require "rails_helper"

RSpec.describe "POST /api/budget/category/:category_key/maturity_interals/:month/:year" do
  subject do
    post(api_budget_category_maturity_intervals_path(category_key, *optional_path_args), headers: headers)
  end

  let(:optional_path_args) { [] }

  context "when creating a maturity interval" do
    include_context "with valid token"

    context "when not passing a month / year" do
      let(:category) { FactoryBot.create(:category, :accrual, user_group: user.group) }
      let(:category_key) { category.key }
      let(:interval) { Budget::Interval.belonging_to(user).current }

      it "creates a new maturity interval" do
        expect { subject }.to change { Budget::CategoryMaturityInterval.count }.by(+1)
        expect(response).to have_http_status :created
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body).to eq(
          budgetCategory: {
            key: category_key,
            maturityIntervals: [{ month: interval.month, year: interval.year }],
          }
        )
      end
    end

    context "when passing a specific month / year" do
      let(:category) { FactoryBot.create(:category, :accrual, user_group: user.group) }
      let(:category_key) { category.key }
      let(:interval) { FactoryBot.create(:budget_interval, :future, user_group: user.group) }
      let(:optional_path_args) { [interval.month, interval.year] }

      it "creates a new maturity interval" do
        expect { subject }.to change { Budget::CategoryMaturityInterval.count }.by(+1)
        expect(response).to have_http_status :created
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body).to eq(
          budgetCategory: {
            key: category_key,
            maturityIntervals: [{ month: interval.month, year: interval.year }],
          }
        )
      end
    end

    context "when passing a non-accrual budget category" do
      let(:category) { FactoryBot.create(:category, user_group: user.group) }
      let(:category_key) { category.key }

      it "creates a new maturity interval" do
        expect { subject }.not_to(change { Budget::CategoryMaturityInterval.count })
        expect(response).to have_http_status :unprocessable_entity
        body = JSON.parse(response.body).deep_symbolize_keys
        expect(body).to eq(
          budgetCategoryMaturityInterval: {
            budgetCategory: ["must be an accrual"],
          }
        )
      end
    end
  end

  context "when a budget category is not found" do
    include_context "with valid token"

    before { allow(Budget::Category).to receive(:fetch) }

    it_behaves_like "endpoint requires budget category"
  end

  context "when passing invalid month / year params" do
    include_context "with valid token"
    let(:optional_path_args) { [month, year] }
    let(:category_key) { SecureRandom.hex(6) }

    before do
      allow(Budget::Category).to receive(:fetch).and_return(instance_double(Budget::Category))
    end

    it_behaves_like "endpoint requires budget interval"
  end

  context "when passing an invalid token" do
    let(:category_key) { SecureRandom.hex(6) }

    it_behaves_like "a token authenticated endpoint"
  end
end
