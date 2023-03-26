require "rails_helper"

RSpec.describe "POST /api/accounts", type: :request do
  subject { post("/api/accounts", params: params, headers: headers) }

  context "when passing a valid token" do
    let(:user) { FactoryBot.create(:user) }

    include_context "with valid token"

    context "when passing valid params" do
      let(:params) do
        {
          account: {
            name: "Fourth County Bank",
            slug: "checking",
            priority: rand(100),
            isCashFlow: true,
            key: SecureRandom.hex(6),
          },
        }
      end

      it "creates a new account" do
        expect { subject }
          .to change { Account.belonging_to(user).count }
          .by(+1)
      end

      it "returns a created status an account object" do
        subject
        expect(response).to have_http_status :created
        expect(JSON.parse(response.body).fetch("account")).to eq(
          params
          .fetch(:account)
          .merge(
            is_archived: false,
            archived_at: nil,
            balance: 0,
          ).deep_transform_keys { |key| key.to_s.camelize(:lower) }
        )
      end
    end

    context "when passing invalid params" do
      let(:params) do
        {
          account: {
            name: "Fourth County Bank",
            slug: "checking",
            priority: rand(100),
            is_cash_flow: true,
            key: "",
          },
        }
      end

      it "returns an unprocessable entity status, an error hash" do
        subject
        expect(response).to have_http_status :unprocessable_entity
      end
    end
  end

  it_behaves_like "a token authenticated endpoint"
end
