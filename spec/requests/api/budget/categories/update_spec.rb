require "rails_helper"

RSpec.describe "PUT /api/budget/category/:category_key" do
  subject do
    put(
      api_budget_category_path(category_key),
      params: params,
      headers: headers
    )
  end

  context "when passing valid params" do
    include_context "with valid token"

    let(:category) { create(:category, :accrual, user_group: user.group) }
    let(:category_key) { category.key }
    let(:params) do
      { budget_category: { is_accrual: false } }
    end

    it "updates the category, and returns a serialized category" do
      expect { subject }
        .to change { category.reload.accrual? }
        .from(true)
        .to(false)
    end
  end

  context "when passing invalid params" do
    include_context "with valid token"

    let(:category) { create(:category, :expense, user_group: user.group) }
    let(:category_key) { category.key }
    let(:params) do
      { budget_category: { default_amount: 100_00, expense: false } }
    end

    it "returns an unprocessable entity status, error messages" do
      subject
      expect(response).to have_http_status :unprocessable_entity
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(budgetCategory: { expense: ["cannot be changed after creation"] })
    end
  end

  context "when the controller fails to find the budget category by key" do
    include_context "with valid token"

    let(:params) { {} }

    it_behaves_like "endpoint requires budget category"
  end

  context "when the params are not correctly nested" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:category) { create(:category, :expense, user_group: user.group) }
    let(:category_key) { category.key }
    let(:params) do
      { default_amount: 100_00, expense: false }
    end

    it "responds with a 400, errors" do
      subject
      expect(response).to have_http_status :bad_request
      expect(response.parsed_body).to eq(
        "error" => "param is missing or the value is empty: budget_category"
      )
    end
  end

  context "when passing an invalid token" do
    let(:params) { {} }
    let(:category_key) { KeyGenerator.call }

    it_behaves_like "a token authenticated endpoint"
  end
end
