require "rails_helper"

RSpec.describe "DELETE /api/tokens" do
  subject { delete("/api/tokens", headers: headers) }

  context "when passing a valid token" do
    let(:user) { FactoryBot.create(:user) }

    before { auth_token_context }

    include_context "with valid token"

    it "expires the current token context" do
      expect { subject }
        .to change { Auth::Token::Context.belonging_to(user).active.count }
        .by(-1)
      expect(response).to have_http_status :accepted
      expect(JSON.parse(response.body)).to be_empty
    end
  end

  it_behaves_like "a token authenticated endpoint"
end
