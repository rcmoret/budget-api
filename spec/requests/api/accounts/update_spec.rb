require "rails_helper"

RSpec.describe "PUT /api/accounts/:key" do
  subject do
    put(api_account_path(account_key), params:, headers:)
  end

  context "when the account is not found" do
    include_context "with valid token"

    let(:account_key) { KeyGenerator.call }
    let(:params) do
      {
        account: {
          name: "Fourth County Bank",
          slug: "checking",
        },
      }
    end

    include_examples "endpoint requires account"
  end

  context "when passing a key for an unrelated account" do
    include_context "with valid token"
    include_context "with an account belonging to a different user group"

    let(:params) { {} }
    let(:account_key) { other_groups_account.key }

    include_examples "endpoint requires account"
  end

  context "when passing a valid token" do
    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.user_group) }
    let(:account_key) { account.key }

    include_context "with valid token"

    context "when passing valid params" do
      let(:params) do
        {
          account: {
            name: "Fourth County Bank",
            slug: "checking",
          },
        }
      end

      it "updates the existing account" do
        expect { subject }
          .to change { account.reload.name }
          .to(params.fetch(:account).fetch(:name))
      end

      it "returns a created status an account object" do
        subject
        expect(response).to have_http_status :accepted
        expect(response.parsed_body.fetch("account"))
          .to include params.fetch(:account).stringify_keys
      end
    end

    context "when passing invalid params" do
      let(:user) { create(:user) }
      let(:account) { create(:account, user_group: user.user_group) }
      let(:account_key) { account.key }
      let(:params) do
        {
          account: {
            priority: nil,
            isCashFlow: true,
          },
        }
      end

      it "returns an unprocessable entity status, an error hash" do
        subject
        expect(response).to have_http_status :unprocessable_entity
      end
    end

    context "when the params are incorrectly nested" do
      let(:user) { create(:user) }
      let(:params) do
        {
          priority: nil,
          isCashFlow: true,
        }
      end

      it "returns a 400, errors" do
        subject
        expect(response).to have_http_status :bad_request
        expect(response.parsed_body).to eq(
          "error" => "param is missing or the value is empty: account",
        )
      end
    end
  end

  context "when providing an invalid token" do
    let(:user) { create(:user) }
    let(:account) { create(:account, user_group: user.user_group) }
    let(:account_key) { account.key }

    it_behaves_like "a token authenticated endpoint"
  end

  context "when providing another group's account key" do
    include_context "with valid token"
    include_context "with an account belonging to a different user group"
    let(:params) { { account: { isCashFlow: true } } }
    let(:account_key) { other_groups_account.key }

    include_examples "endpoint requires account"
  end
end
