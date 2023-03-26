require "rails_helper"

RSpec.describe "POST /api/accounts/:account_key/transactions/:month/:year" do
  subject do
    post(
      api_account_transactions_path(account_key, month, year),
      params: params,
      headers: headers
    )
  end

  context "when providing a single detail" do
    around do |ex|
      freeze_time { ex.run }
    end

    include_context "with valid token"
    include_context "when the user posts transaction with a single detail"
    include_context "when the user has an account"

    let(:account_key) { account.key }
    let(:amount) { 100_00 }
    let(:budget_exclusion) { false }

    it "returns a created status, the account and transaction" do
      subject
      expect(response).to have_http_status :created
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body.fetch(:accounts)).to eq([{ key: account_key, balance: amount, balancePriorTo: 0 }])
      expect(body.fetch(:budgetItems))
        .to eq([{ key: budget_item.key, remaining: 0, isDeletable: false, isMonthly: true }])
      expect(body.fetch(:transactions))
        .to eq(
          [
            {
              key: params.fetch("transaction").fetch("key"),
              amount: amount,
              clearanceDate: params.fetch("transaction").fetch("clearanceDate"),
              description: params.fetch("transaction").fetch("description"),
              checkNumber: nil,
              notes: nil,
              isBudgetExclusion: false,
              updatedAt: Time.current.strftime("%FT%TZ"),
              details: [
                {
                  key: params.dig("transaction", "detailsAttributes", "0", "key"),
                  amount: amount,
                  budgetCategoryName: budget_category.name,
                  budgetItemKey: budget_item.key,
                  iconClassName: budget_category.icon_class_name,
                },
              ],
            },
          ],
        )
    end
  end

  context "when providing multiple details" do
    around do |ex|
      freeze_time { ex.run }
    end

    include_context "with valid token"
    include_context "when user posts transaction with multiple details"
    let(:account_key) { account.key }
    let(:total) { [first_amount, second_amount].sum }

    it "returns a created status, the account and transaction" do
      subject
      expect(response).to have_http_status :created
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body.fetch(:accounts)).to eq([{ key: account_key, balance: total, balancePriorTo: 0 }])
      expect(body.fetch(:budgetItems))
        .to eq([{ key: budget_item.key, remaining: 0, isDeletable: false, isMonthly: true }])
      expect(body.fetch(:transactions))
        .to eq(
          [
            {
              key: params.fetch("transaction").fetch("key"),
              amount: total,
              clearanceDate: params.fetch("transaction").fetch("clearanceDate"),
              description: params.fetch("transaction").fetch("description"),
              checkNumber: nil,
              notes: nil,
              isBudgetExclusion: false,
              updatedAt: Time.current.strftime("%FT%TZ"),
              details: [
                {
                  key: params.dig("transaction", "detailsAttributes", "0", "key"),
                  amount: first_amount,
                  budgetCategoryName: budget_category.name,
                  budgetItemKey: budget_item.key,
                  iconClassName: budget_category.icon_class_name,
                },
                {
                  key: params.dig("transaction", "detailsAttributes", "1", "key"),
                  amount: second_amount,
                  budgetCategoryName: nil,
                  budgetItemKey: nil,
                  iconClassName: nil,
                },
              ],
            },
          ],
        )
    end
  end

  context "when providing no details" do
    include_context "when user posts transaction with no details"
    include_context "with valid token"

    let(:account_key) { account.key }

    it "returns an unprocessable entity status, an error" do
      subject
      expect(response).to have_http_status :unprocessable_entity
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body)
        .to eq(transaction: { details: ["Must have at least one detail for this entry"] })
    end
  end

  context "when the account is not found" do
    include_context "with valid token"

    let(:account_key) { SecureRandom.hex(6) }
    let(:month) { (1..12).to_a.sample }
    let(:year) { (2010..2024).to_a.sample }
    let(:params) do
      {
        "transaction" => {
          "description" => "Publix",
          "clearanceDate" => nil,
          "key" => SecureRandom.hex(6),
          "detailsAttributes" => {
            "0" => {
              "key" => SecureRandom.hex(6),
              "amount" => 170_35,
            },
          },
        },
      }
    end

    it "returns a not found status, an error" do
      subject
      expect(response).to have_http_status :not_found
      body = JSON.parse(response.body).symbolize_keys
      expect(body).to eq(account: "not found by key: #{account_key}")
    end
  end

  context "when providing invalid month/year combination" do
    let(:params) { { transaction: {} } }

    include_context "with valid token"
    include_examples "endpoint requires budget interval"
  end

  context "when budget exclusion is true" do
    context "when the account is cash flow" do
      include_context "with valid token"
      include_context "when the user posts transaction with a single detail"
      include_context "when the user has an account"

      let(:account_key) { account.key }
      let(:amount) { 100_00 }
      let(:budget_exclusion) { true }
      let(:budget_item) { nil }

      it "returns an unprocessable entity status, an error message" do
        expect { subject }.not_to(change { Transaction::Entry.count })
        expect(response).to have_http_status :unprocessable_entity
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body[:transaction])
          .to eq(budgetExclusion: ["Budget Exclusions only applicable for non-cash-flow accounts"])
      end
    end

    context "when the account is non-cash flow" do
      around do |ex|
        freeze_time { ex.run }
      end

      include_context "with valid token"
      include_context "when the user posts transaction with a single detail"
      include_context "when the user has a non-cash-flow account"

      let(:account_key) { account.key }
      let(:amount) { 100_00 }
      let(:budget_exclusion) { true }
      let(:budget_item) { nil }

      it "returns a created status, the account and transaction" do
        subject
        expect(response).to have_http_status :created
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body.fetch(:accounts)).to eq([{ key: account_key, balance: amount, balancePriorTo: 0 }])
        expect(body[:budgetItems]).to be nil
        expect(body.fetch(:transactions))
          .to eq(
            [
              {
                key: params.fetch("transaction").fetch("key"),
                amount: amount,
                clearanceDate: params.fetch("transaction").fetch("clearanceDate"),
                description: params.fetch("transaction").fetch("description"),
                checkNumber: nil,
                notes: nil,
                isBudgetExclusion: true,
                updatedAt: Time.current.strftime("%FT%TZ"),
                details: [
                  {
                    key: params.dig("transaction", "detailsAttributes", "0", "key"),
                    amount: amount,
                    budgetCategoryName: nil,
                    budgetItemKey: nil,
                    iconClassName: nil,
                  },
                ],
              },
            ],
          )
      end
    end
  end

  context "when creating a transaction prior to the selected interval" do
    include_context "when the user has an account"
    include_context "when the user posts transaction with a single detail and a clearance date"
    include_context "with valid token"

    let(:clearance_date) { interval.prev.date_range.to_a.sample }
    let(:budget_exclusion) { false }
    let(:amount) { 100_00 }
    let(:account_key) { account.key }

    around do |ex|
      freeze_time { ex.run }
    end

    it "returns a created status, the account and transaction" do
      subject
      expect(response).to have_http_status :created
      body = JSON.parse(response.body).deep_symbolize_keys
      expect(body.fetch(:accounts)).to eq([{ key: account_key, balance: amount, balancePriorTo: amount }])
      expect(body.fetch(:budgetItems))
        .to eq([{ key: budget_item.key, remaining: 0, isDeletable: false, isMonthly: true }])
      expect(body.fetch(:transactions))
        .to eq(
          [
            {
              key: params.fetch("transaction").fetch("key"),
              amount: amount,
              clearanceDate: params.fetch("transaction").fetch("clearanceDate").strftime("%F"),
              description: params.fetch("transaction").fetch("description"),
              checkNumber: nil,
              notes: nil,
              isBudgetExclusion: false,
              updatedAt: Time.current.strftime("%FT%TZ"),
              details: [
                {
                  key: params.dig("transaction", "detailsAttributes", "0", "key"),
                  amount: amount,
                  budgetCategoryName: budget_category.name,
                  budgetItemKey: budget_item.key,
                  iconClassName: budget_category.icon_class_name,
                },
              ],
            },
          ],
        )
    end
  end

  context "when submitting a detail for a monthly item that has a detail associated" do
    include_context "with valid token"
    include_context "when the user posts transaction with a single detail"
    include_context "when the user has an account"

    let(:account_key) { account.key }
    let(:amount) { 100_00 }
    let(:budget_exclusion) { false }

    before do
      FactoryBot.create(:transaction_detail, budget_item: budget_item)
    end

    it "returns an unprocessable entity status, an error message" do
      subject
      expect(response).to have_http_status :unprocessable_entity
      body = JSON.parse(response.body)
      expect(body["transaction"])
        .to eq("details.budgetItemId" => ["has already been taken"])
    end
  end

  describe "token authentication" do
    let(:account_key) { SecureRandom.hex(6) }
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2039) }
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end