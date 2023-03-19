require "rails_helper"

RSpec.describe "PUT /api/accounts/:key", type: :request do
  subject { put("/api/accounts/#{key}", params: params, headers: headers) }

  context "when passing a valid token" do
    let(:user) { FactoryBot.create(:user) }
    let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
    let(:key) { account.key }

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
        expect(JSON.parse(response.body).fetch("account"))
          .to include params.fetch(:account).stringify_keys
      end
    end

    context "when passing invalid params" do
      let(:user) { FactoryBot.create(:user) }
      let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
      let(:key) { account.key }
      let(:params) do
        {
          account: {
            priority: nil,
            is_cash_flow: true,
          },
        }
      end

      it "returns an unprocessable entity status, an error hash" do
        subject
        expect(response).to have_http_status :unprocessable_entity
      end
    end
  end

  context "when providing an invalid token" do
    let(:user) { FactoryBot.create(:user) }
    let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
    let(:key) { account.key }

    it_behaves_like "a token authenticated endpoint"
  end
end
