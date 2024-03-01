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

    before { create(:user, email: email, password: password) }

    it "returns a token" do
      subject
      body = response.parsed_body
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

    context "when passing an incorrect password" do
      before { create(:user, email: email, password: password) }

      let(:params) do
        { user: { email: email, password: incorrect_password } }
      end

      it "an error message, unprocessable entity status" do
        subject
        expect(response.parsed_body).to eq("password" => ["incorrect password"])
        expect(response).to have_http_status :unauthorized
      end
    end

    context "when the params are not correctly nested" do
      let(:params) do
        { email: email, password: incorrect_password }
      end

      it "returns a 400, errors" do
        subject
        expect(response).to have_http_status :bad_request
        expect(response.parsed_body).to eq(
          "error" => "param is missing or the value is empty: user",
        )
      end
    end
  end
end
