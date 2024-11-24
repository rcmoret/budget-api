require "rails_helper"

RSpec.describe "GET /api/budget/interval/draft/:month/:year" do
  subject do
    get api_budget_interval_draft_path(month, year), headers: headers, params: params
  end

  context "when making a request with valid token" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:group) { user.group }
    let(:groc_category) { create(:category, :expense, :weekly, user_group: group) }
    let(:salary_category) { create(:category, :revenue, :monthly, user_group: group) }
    let(:interval) { create(:budget_interval, user_group: group) }
    let(:groceries) { create(:budget_item, category: groc_category, interval: interval) }
    let(:month) { interval.month }
    let(:year) { interval.year }

    context "when passing an invalid budget category key" do
      let(:budget_item_key)  { SecureRandom.hex(6) }
      let(:params) { { changes: changes } }
      let(:changes) do
        [
          {
            budget_item_key: budget_item_key,
            budget_category_key: SecureRandom.hex(6),
            amount: 20_00,
          },
        ]
      end

      it "returns a 422, errors" do
        subject
        expect(response.parsed_body).to eq(
          [
            {
              budget_item_key => {
                "category_id" => ["can't be blank"],
              },
            },
          ]
        )
      end
    end

    context "when passing an invalid amount" do
      let(:params) { { changes: changes } }
      let(:changes) do
        [
          {
            budget_item_key: groceries.key,
            budget_category_key: groc_category.key,
            amount: 20.0,
          },
        ]
      end

      it "returns a 422, errors" do
        subject
        expect(response.parsed_body).to eq(
          [
            {
              groceries.key => {
                "amount" => ["must be an integer"],
              },
            },
          ]
        )
      end
    end

    context "when failing to property nest the params" do
      let(:params) { { params: changes } }
      let(:changes) do
        [
          {
            budget_item_key: groceries.key,
            budget_category_key: groc_category.key,
            amount: 20.0,
          },
        ]
      end

      it "returns a 400, errors" do
        subject
        expect(response).to have_http_status :bad_request
        expect(response.parsed_body).to eq(
          "error" => "param is missing or the value is empty: changes",
        )
      end
    end

    context "when passing valid changes" do
      let(:salary_key) { SecureRandom.hex(6) }
      let(:params) { { changes: changes } }
      let(:changes) do
        [
          {
            budget_item_key: groceries.key,
            budget_category_key: groc_category.key,
            amount: update_amount,
          },
          {
            budget_item_key: salary_key,
            budget_category_key: salary_category.key,
            amount: 500_00,
          },
        ]
      end

      before do
        create(:budget_item_event, :create_event, item: groceries, amount: -100_00)
        create(:transaction_detail, budget_item: groceries, amount: -130_00)
      end

      context "when adjusting less than the over budget amount" do
        let(:update_amount) { -20_00 }

        it "returns updated discretionary and draft items" do
          subject
          expect(response.parsed_body).to eq(
            "discretionary" => {
              "amount" => 500_00,
              "overUnderBudget" => -10_00,
            },
            "items" => [
              {
                "name" => groc_category.name,
                "key" => groceries.key,
                "budgetCategoryKey" => groc_category.key,
                "budgetCategoryName" => groc_category.name,
                "amount" => -120_00,
                "remaining" => 0,
                "difference" => 10_00,
                "spent" => -130_00,
                "iconClassName" => groc_category.icon_class_name,
                "isMonthly" => groc_category.monthly?,
                "isNewItem" => false,
              },
              {
                "name" => salary_category.name,
                "key" => salary_key,
                "budgetCategoryKey" => salary_category.key,
                "budgetCategoryName" => salary_category.name,
                "amount" => 500_00,
                "remaining" => 500_00,
                "difference" => 500_00,
                "spent" => 0,
                "iconClassName" => groc_category.icon_class_name,
                "isMonthly" => salary_category.monthly?,
                "isNewItem" => true,
              },
            ],
          )
        end
      end

      context "when adjusting more than the over budget amount" do
        let(:update_amount) { -40_00 }

        it "returns updated discretionary and draft items" do
          subject
          expect(response.parsed_body).to eq(
            "discretionary" => {
              "amount" => 490_00,
              "overUnderBudget" => 0,
            },
            "items" => [
              {
                "name" => groc_category.name,
                "key" => groceries.key,
                "budgetCategoryKey" => groc_category.key,
                "budgetCategoryName" => groc_category.name,
                "amount" => -140_00,
                "remaining" => -10_00,
                "difference" => -10_00,
                "spent" => -130_00,
                "iconClassName" => groc_category.icon_class_name,
                "isMonthly" => groc_category.monthly?,
                "isNewItem" => false,
              },
              {
                "name" => salary_category.name,
                "key" => salary_key,
                "budgetCategoryKey" => salary_category.key,
                "budgetCategoryName" => salary_category.name,
                "amount" => 500_00,
                "remaining" => 500_00,
                "iconClassName" => salary_category.icon_class_name,
                "difference" => 500_00,
                "spent" => 0,
                "isMonthly" => salary_category.monthly?,
                "isNewItem" => true,
              },
            ],
          )
        end
      end
    end
  end

  context "with an invalid token" do
    let(:month) { rand(1..12) }
    let(:year) { rand(2020..2035) }
    let(:params) { [] }

    it_behaves_like "a token authenticated endpoint"
  end

  context "when passing an invalid month year combination" do
    let(:params) { [] }

    include_context "with valid token"

    it_behaves_like "endpoint requires budget interval"
  end
end
