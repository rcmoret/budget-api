require "rails_helper"

RSpec.describe "PUT /api/account/:account_key/transaction/:key/:month/:year" do
  subject do
    put(api_account_transaction_path(account_key, transaction_key, month, year),
      params:,
      headers:)
  end

  context "when updating the entry itself" do
    context "when the account is not found" do
      include_context "with valid token"

      let(:account_key) { KeyGenerator.call }
      let(:transaction_key) { KeyGenerator.call }
      let(:params) { {} }

      include_examples "endpoint requires account"
    end

    context "when passing an unrelated account key" do
      include_context "with valid token"
      include_context "with an account belonging to a different user group"

      let(:account_key) { other_groups_account.key }
      let(:transaction_key) { KeyGenerator.call }
      let(:params) { {} }

      include_examples "endpoint requires account"
    end

    context "when the transaction is not found" do
      include_context "with valid token"

      let(:params) { { transaction: { description: "Updated Description" } } }

      include_examples "endpoint requires transaction entry"
    end

    context "when providing invalid month/year combination" do
      let(:transaction_key) { KeyGenerator.call }
      let(:params) { {} }

      include_context "with valid token"
      include_examples "endpoint requires budget interval"
    end

    context "when changing the associated account" do
      include_context "with valid token"

      let(:user) { create(:user) }
      let(:account) { create(:account, user_group: user.group) }
      let(:account_key) { account.key }
      let(:savings_account) { create(:savings_account, user_group: user.group) }
      let(:transaction) do
        create(:transaction_entry, :pending, account:)
      end
      let(:transaction_key) { transaction.key }
      let(:interval) { create(:budget_interval, user_group: user.group) }
      let(:month) { interval.month }
      let(:year) { interval.year }
      let(:params) do
        {
          "transaction" => {
            "clearance_date" => interval.first_date,
            "account_key" => savings_account.key,
          },
        }
      end

      around do |ex|
        freeze_time { ex.call }
      end

      it "returns an accepted status, the transactions, accounts and budget items" do
        subject
        expect(response).to have_http_status :accepted
        body = response.parsed_body.deep_symbolize_keys
        expect(body[:accounts]).to contain_exactly(
          { key: account.key, balance: 0, balancePriorTo: 0 },
          { key: savings_account.key, balance: transaction.total,
            balancePriorTo: 0, }
        )
        expect(body[:budgetItems]).to be_nil
        expect(body[:transactions]).to eq(
          [
            {
              key: transaction.key,
              amount: transaction.total,
              accountKey: savings_account.key,
              accountSlug: savings_account.slug,
              clearanceDate: params.fetch("transaction").fetch("clearance_date")&.strftime("%F"),
              description: transaction.description,
              checkNumber: transaction.check_number,
              notes: transaction.notes,
              isBudgetExclusion: transaction.budget_exclusion?,
              updatedAt: Time.current.strftime("%FT%TZ"),
              details: transaction.details.map do |detail|
                {
                  key: detail.key,
                  amount: detail.amount,
                  budgetCategoryName: detail.budget_item.name,
                  budgetItemKey: detail.budget_item.key,
                  iconClassName: detail.budget_item.category.icon_class_name,
                }
              end,
            },
          ]
        )
      end
    end

    context "when updating budget exclusion to be true" do
      context "when the account is non-cash flow" do
        include_context "with valid token"

        let(:user) { create(:user) }
        let(:account) { create(:account, user_group: user.group) }
        let(:account_key) { account.key }
        let(:transaction) do
          create(:transaction_entry, :discretionary, account:)
        end
        let(:transaction_key) { transaction.key }
        let(:interval) { create(:budget_interval, user_group: user.group) }
        let(:month) { interval.month }
        let(:year) { interval.year }
        let(:params) { { "transaction" => { "is_budget_exclusion" => true } } }

        it "returns an unprocessable entity status, error message" do
          subject
          expect(response).to have_http_status :unprocessable_entity
          body = response.parsed_body.deep_symbolize_keys
          expect(body)
            .to eq(
              transaction: {
                budgetExclusion: [
                  "Budget Exclusions only applicable for non-cash-flow accounts",
                ],
              }
            )
        end
      end

      context "when the account is cash flow" do
        include_context "with valid token"

        let(:user) { create(:user) }
        let(:savings_account) do
          create(:savings_account, user_group: user.group)
        end
        let(:account_key) { savings_account.key }
        let(:transaction) do
          create(:transaction_entry, :discretionary, account: savings_account)
        end
        let(:transaction_key) { transaction.key }
        let(:interval) { create(:budget_interval, user_group: user.group) }
        let(:month) { interval.month }
        let(:year) { interval.year }
        let(:params) { { "transaction" => { "budgetExclusion" => true } } }

        it "returns an unprocessable entity, an error" do
          subject
          expect(response).to have_http_status :accepted
        end
      end
    end
  end

  context "when updating a detail" do
    context "when changing the budget item" do
      include_context "with valid token"

      let(:user) { create(:user) }
      let(:account) { create(:account, user_group: user.group) }
      let(:account_key) { account.key }
      let(:transaction) do
        create(:transaction_entry, :discretionary, account:)
      end
      let(:transaction_key) { transaction.key }
      let(:interval) { create(:budget_interval, user_group: user.group) }
      let(:category) { create(:category, user_group: user.group) }
      let(:budget_item) do
        create(:budget_item, interval:, category:)
      end
      let(:month) { interval.month }
      let(:year) { interval.year }
      let(:detail) { transaction.details.first }
      let(:params) do
        {
          "transaction" => {
            "details_attributes" => [
              {
                "key" => detail.key,
                "budget_item_key" => budget_item.key,
              },
            ],
          },
        }
      end

      it "returns an accepted status" do
        subject
        expect(response).to have_http_status :accepted
        body = response.parsed_body.deep_symbolize_keys
        expect(body.dig(:transactions, 0, :details)).to eq(
          [
            {
              key: detail.key,
              amount: detail.amount,
              budgetItemKey: budget_item.key,
              budgetCategoryName: budget_item.name,
              iconClassName: budget_item.category.icon_class_name,
            },
          ]
        )
      end
    end
  end

  context "when adding an additional detail" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.group) }
    let(:account_key) { account.key }
    let!(:transaction) do
      create(:transaction_entry, :discretionary, account:)
    end
    let(:transaction_key) { transaction.key }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:category) { create(:category, user_group: user.group) }
    let(:budget_item) do
      create(:budget_item, interval:, category:)
    end
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:params) do
      {
        "transaction" => {
          "details_attributes" => [
            {
              "key" => KeyGenerator.call,
              "budget_item_key" => budget_item.key,
              "amount" => rand(100_00),
            },
          ],
        },
      }
    end

    it "returns an accepted status" do
      expect { subject }.to change { Transaction::Detail.count }.by(+1)
      expect(response).to have_http_status :accepted
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:budgetItems]).to eq(
        [
          {
            key: budget_item.key,
            isDeletable: false,
            isMonthly: budget_item.monthly?,
            remaining: budget_item.decorated.remaining,
          },
        ]
      )
      expect(body.dig(:transactions, 0, :details)).to include(
        key: params.dig("transaction", "details_attributes", 0, "key"),
        amount: params.dig("transaction", "details_attributes", 0, "amount"),
        budgetItemKey: budget_item.key,
        budgetCategoryName: budget_item.name,
        iconClassName: budget_item.category.icon_class_name,
      )
    end
  end

  context "when adding an additional detail and the budget item belongs to a different interval" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.group) }
    let(:account_key) { account.key }
    let!(:transaction) do
      create(:transaction_entry, :discretionary, account:)
    end
    let(:transaction_key) { transaction.key }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:category) { create(:category, user_group: user.group) }
    let(:budget_item) do
      create(:budget_item, interval: interval.prev, category:)
    end
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:params) do
      {
        "transaction" => {
          "details_attributes" => [
            {
              "key" => KeyGenerator.call,
              "budget_item_key" => budget_item.key,
              "amount" => rand(100_00),
            },
          ],
        },
      }
    end

    it "returns an accepted status" do
      expect { subject }.to change { Transaction::Detail.count }.by(+1)
      expect(response).to have_http_status :accepted
      body = response.parsed_body.deep_symbolize_keys
      expect(body[:budgetItems]).to be_nil
    end
  end

  context "when removing a detail" do
    context "when multiple details are present" do
      include_context "with valid token"

      let(:user) { create(:user) }
      let(:account) { create(:account, user_group: user.group) }
      let(:account_key) { account.key }
      let(:transaction) do
        create(:transaction_entry, :with_multiple_details, account:)
      end
      let(:transaction_key) { transaction.key }
      let(:detail) { transaction.details.to_a.sample }
      let(:month) { (1..12).to_a.sample }
      let(:year) { (2010..2039).to_a.sample }
      let(:params) do
        {
          "transaction" => {
            "details_attributes" => [
              {
                "key" => detail.key,
                "_destroy" => true,
              },
            ],
          },
        }
      end

      it "deletes the transaction" do
        expect { subject }.to change { transaction.reload.details.count }.by(-1)
      end
    end

    context "when there is only one detail present" do
      include_context "with valid token"

      let(:user) { create(:user) }
      let(:account) { create(:account, user_group: user.group) }
      let(:account_key) { account.key }
      let(:transaction) do
        create(:transaction_entry, account:)
      end
      let(:transaction_key) { transaction.key }
      let(:detail) { transaction.details.first }
      let(:month) { (1..12).to_a.sample }
      let(:year) { (2010..2039).to_a.sample }
      let(:params) do
        {
          "transaction" => {
            "details_attributes" => [
              {
                "key" => detail.key,
                "_destroy" => true,
              },
            ],
          },
        }
      end

      it "deletes the transaction" do
        expect { subject }.not_to(change { transaction.reload.details.count })
        expect(response).to have_http_status :unprocessable_entity
        body = response.parsed_body.deep_symbolize_keys
        expect(body).to eq(
          transaction: { details: [ "Must have at least one detail for this entry" ] }
        )
      end
    end
  end

  context "when updating an entry that is a transfer" do
    include_context "with valid token"

    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:month) { interval.month }
    let(:year) { interval.year }
    let(:account) { create(:account, user_group: user.group) }
    let(:savings_account) { create(:savings_account, user_group: user.group) }
    let(:original_amount) { rand(100_00) }
    let(:transfer_result) do
      Forms::TransferForm.new(
        user:,
        params: {
          amount: original_amount,
          from_account_key: account.key,
          to_account_key: savings_account.key,
        }
      ).call
    end
    let(:transaction_entry) { transfer_result.last[:transfer].to_transaction }
    let(:account_key) { transaction_entry.account.key }
    let(:transaction_key) { transaction_entry.key }
    let(:detail_key) { transaction_entry.details.first.key }
    let(:params) do
      {
        "transaction" => {
          "details_attributes" => [
            {
              "key" => detail_key,
              "amount" => (rand(100_00) + original_amount),
            },
          ],
        },
      }
    end

    it "does not update the transaction" do
      expect { subject }.not_to(change { transaction_entry.reload.total })
      expect(response).to have_http_status :unprocessable_entity
      body = response.parsed_body
      expect(body.dig("transaction", "detailItems")).to eq(
        [
          {
            "identifier" => detail_key,
            "amount" => [ "Cannot be changed for a transfer" ],
          },
        ]
      )
    end
  end

  context "when the params are not correctly nested" do
    include_context "with valid token"

    let(:account) { create(:account, user_group: user.group) }
    let(:account_key) { account.key }
    let(:transaction) { create(:transaction_entry, account:) }
    let(:transaction_key) { transaction.key }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { { transaction: {} } }

    it "responds with a 400, an error message" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq(
        "error" => "param is missing or the value is empty: transaction",
      )
    end
  end

  describe "token authentication" do
    let(:account_key) { KeyGenerator.call }
    let(:transaction_key) { KeyGenerator.call }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end
