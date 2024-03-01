require "rails_helper"

RSpec.describe "POST /api/budget/categories" do
  subject do
    post(
      api_budget_categories_path,
      params: params,
      headers: headers
    )
  end

  context "when passing valid params" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:name) { Faker::Music::GratefulDead.song }
    let(:slug) { Faker::Lorem.word.downcase }
    let(:key) { SecureRandom.hex(6) }
    let(:params) do
      {
        budget_category: {
          key: key,
          default_amount: default_amount,
          is_accrual: is_accrual,
          is_expense: is_expense,
          icon_id: icon.id,
          is_per_diem_enabled: is_per_diem_enabled,
          is_monthly: is_monthly,
          name: name,
          slug: slug,
        },
      }
    end

    context "when creating a revenue category" do
      let(:is_accrual) { false }
      let(:is_expense) { false }
      let(:is_per_diem_enabled) { false }
      let(:is_monthly) { [true, false].sample }
      let(:default_amount) { rand(10_00..100_00) }

      it "creates a new record and returns the new record information" do
        expect { subject }
          .to change { Budget::Category.belonging_to(user).count }
          .by(+1)
        expect(response).to have_http_status :created
        body = response.parsed_body.deep_symbolize_keys
        expect(body).to eq(
          budgetCategory: {
            key: key,
            archivedAt: nil,
            defaultAmount: default_amount,
            isAccrual: is_accrual,
            isExpense: is_expense,
            iconClassName: icon.class_name,
            isPerDiemEnabled: is_per_diem_enabled,
            isMonthly: is_monthly,
            name: name,
            slug: slug,
          }
        )
      end
    end

    context "when creating a expense category" do
      let(:is_accrual) { false }
      let(:is_expense) { true }
      let(:is_per_diem_enabled) { [true, false].sample }
      let(:is_monthly) { false }
      let(:default_amount) { rand(-100_00..-10_00) }

      it "creates a new record and returns the new record information" do
        expect { subject }
          .to change { Budget::Category.belonging_to(user).count }
          .by(+1)
        expect(response).to have_http_status :created
        body = response.parsed_body.deep_symbolize_keys
        expect(body).to eq(
          budgetCategory: {
            key: key,
            archivedAt: nil,
            defaultAmount: default_amount,
            isAccrual: is_accrual,
            isExpense: is_expense,
            iconClassName: icon.class_name,
            isPerDiemEnabled: is_per_diem_enabled,
            isMonthly: is_monthly,
            name: name,
            slug: slug,
          }
        )
      end
    end

    context "when creating an accruing expense category" do
      let(:is_accrual) { true }
      let(:is_expense) { true }
      let(:is_per_diem_enabled) { [true, false].sample }
      let(:is_monthly) { false }
      let(:default_amount) { rand(-100_00..-10_00) }

      it "creates a new record and returns the new record information" do
        expect { subject }
          .to change { Budget::Category.belonging_to(user).count }
          .by(+1)
        expect(response).to have_http_status :created
        body = response.parsed_body.deep_symbolize_keys
        expect(body).to eq(
          budgetCategory: {
            key: key,
            archivedAt: nil,
            defaultAmount: default_amount,
            isAccrual: is_accrual,
            isExpense: is_expense,
            iconClassName: icon.class_name,
            isPerDiemEnabled: is_per_diem_enabled,
            isMonthly: is_monthly,
            name: name,
            slug: slug,
            maturityIntervals: [],
          }
        )
      end
    end
  end

  context "when passing invalid params" do
    include_context "with valid token"

    let(:icon) { create(:icon) }
    let(:name) { Faker::Music::GratefulDead.song }
    let(:slug) { Faker::Lorem.word.downcase }
    let(:key) { SecureRandom.hex(6) }
    let(:params) do
      {
        budget_category: {
          key: key,
          default_amount: 100_00,
          is_accrual: false,
          is_expense: true,
          icon_id: icon.id,
          is_per_diem_enabled: false,
          is_monthly: false,
          name: name,
          slug: slug,
        },
      }
    end

    it "does not create a new catgory, returns the errors" do
      expect { subject }.not_to(change { Budget::Category.belonging_to(user).count })
      expect(response).to have_http_status :unprocessable_entity
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(
        budgetCategory: { defaultAmount: ["expense items must be less than or equal to 0"] }
      )
    end
  end

  context "when the params are not correctly nested" do
    include_context "with valid token"
    let(:params) do
      {
        key: SecureRandom.hex(6),
        default_amount: 100_00,
        is_accrual: false,
        is_expense: true,
        icon_id: rand(100),
        is_per_diem_enabled: false,
        is_monthly: false,
        name: Faker::Lorem.word,
        slug: Faker::Lorem.word.downcase,
      }
    end

    it "responds with a 400, errors" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq(
        "error" => "param is missing or the value is empty: budget_category",
      )
    end
  end

  context "when passing an invalid token" do
    let(:params) { {} }

    it_behaves_like "a token authenticated endpoint"
  end
end
