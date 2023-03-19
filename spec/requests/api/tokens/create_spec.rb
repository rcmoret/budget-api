require "rails_helper"

RSpec.describe "POST /api/tokens" do
  describe "a successful request" do
    subject do
      post "/api/tokens", params: params
    end

    let(:password) { Faker::Internet.password }
    let(:email) { Faker::Internet.email }
    let(:params) do
      { user: { email: email, password: password } }
    end

    before { FactoryBot.create(:user, email: email, password: password) }

    it "returns a token" do
      subject
      body = JSON.parse(response.body)
      expect(body).to have_key("token")
      expect(response.status).to be 201
    end
  end
end
