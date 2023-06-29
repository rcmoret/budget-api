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
      expect(response).to have_http_status :created
    end
  end

  describe "an unsuccessful request" do
    subject do
      post "/api/tokens", params: params
    end

    let(:password) { Faker::Internet.password }
    let(:incorrect_password) { Faker::Internet.password }
    let(:email) { Faker::Internet.email }
    let(:params) do
      { user: { email: email, password: incorrect_password } }
    end

    before { FactoryBot.create(:user, email: email, password: password) }

    it "an error message, unprocessable entity status" do
      subject
      expect(JSON.parse(response.body)).to eq("password" => ["incorrect password"])
      expect(response).to have_http_status :unauthorized
    end
  end
end
