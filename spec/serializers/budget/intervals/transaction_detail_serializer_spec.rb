require "rails_helper"

RSpec.describe Budget::Intervals::TransactionDetailSerializer do
  describe "#render" do
    subject { described_class.new(transaction_detail) }

    let(:user_group) { create(:user_group, :with_user) }
    let(:account) { create(:account, user_group: user_group) }
    let(:category) { create(:category, user_group: user_group) }
    let(:interval) { create(:budget_interval, user_group: user_group) }
    let(:item) do
      create(
        :budget_item,
        category: category,
        interval: interval,
      )
    end
    let(:detail_key) { SecureRandom.hex(6) }
    let(:amount) { rand(-60_00..60_00) }
    let(:clearance_date) { 2.days.ago }
    let(:transaction_description) { Faker::Music::GratefulDead.song }
    let(:transaction_entry) do
      create(
        :transaction_entry,
        account: account,
        clearance_date: clearance_date,
        description: transaction_description,
        details_attributes: [
          {
            key: detail_key,
            amount: amount,
            budget_item: item,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.first }

    it "returns a hash of attributes" do
      expect(subject.render).to eq(
        "accountName" => account.name,
        "amount" => amount,
        "clearanceDate" => clearance_date.strftime("%F"),
        "description" => transaction_description,
        "key" => detail_key,
        "updatedAt" => transaction_detail.updated_at.strftime("%FT%TZ"),
        "transactionEntryKey" => transaction_entry.key,
      )
    end
  end
end
