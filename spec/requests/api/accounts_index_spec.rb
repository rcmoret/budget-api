require "rails_helper"

RSpec.describe "GET /api/accounts", type: :request do
  subject { get("/api/accounts", headers: headers) }

  context "when providing a valid token" do
    include_context "with valid token"

    before { subject }

    specify { expect(response).to have_http_status(:ok) }
  end

  it_behaves_like "a token authenticated endpoint"
end
