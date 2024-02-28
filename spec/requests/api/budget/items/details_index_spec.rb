require "rails_helper"

RSpec.describe "GET /api/budget/item/:key/details" do
  subject { get api_budget_item_details_path(item_key), headers: headers }

  context "with a valid token" do
    include_context "with valid token"

    let(:user) { create(:user) }
    let(:group) { user.group }

    context "when the item is findable" do
      let(:category) { create(:category, user_group: group) }
      let(:item) { create(:budget_item, category: category) }
      let(:item_key) { item.key }
      let!(:event) do
        create(:budget_item_event, :create_event, item: item)
      end
      let!(:transaction_detail) do
        create(:transaction_detail, budget_item: item)
      end

      it "returns events and transaction details" do
        subject
        expect(response.parsed_body).to eq(
          "transactionDetails" => [
            "key" => transaction_detail.key,
            "accountName" => transaction_detail.entry.account_name,
            "clearanceDate" => transaction_detail.entry.clearance_date.strftime("%F"),
            "amount" => transaction_detail.amount,
            "description" => transaction_detail.entry.description,
          ],
          "events" => [
            {
              "key" => event.key,
              "amount" => event.amount,
              "data" => nil,
              "createdAt" => event.created_at.strftime("%FT%TZ"),
              "typeName" => event.type_name.titleize,
            },
          ],
        )
      end
    end

    context "when the item is not found" do
      let(:item_key) { SecureRandom.hex(6) }

      it "returns a 404, errors" do
        subject
        expect(response).to have_http_status :not_found
        expect(response.parsed_body).to eq(
          "item" => "not found by #{item_key}"
        )
      end
    end
  end

  context "with an invalid token" do
    let(:item_key) { SecureRandom.hex(6) }

    it_behaves_like "a token authenticated endpoint"
  end
end
