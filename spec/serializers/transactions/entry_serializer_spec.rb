require "rails_helper"

RSpec.describe Transactions::EntrySerializer do
  describe "#render" do
    context "when a transfer" do
      subject { described_class.new(transaction_entry.reload) }

      let(:user_group) { FactoryBot.create(:user_group) }
      let(:account) { FactoryBot.create(:account, user_group: user_group) }
      let(:detail_amount) { rand(1..100) }
      let(:detail_key) { SecureRandom.hex(6) }
      let(:description) { Faker::Music::GratefulDead.song }
      let(:notes) { Faker::Music::GratefulDead.song }
      let(:entry_key) { SecureRandom.hex(6) }
      let(:check_number) { Faker::Number.number(digits: 4) }
      let(:interval) { FactoryBot.build(:budget_interval) }
      let(:transaction_entry) do
        FactoryBot.create(
          :transaction_entry,
          description: description,
          account: account,
          key: entry_key,
          check_number: check_number,
          clearance_date: interval.first_date,
          notes: notes,
          details_attributes: [{ amount: detail_amount, key: detail_key }],
        )
      end
      let!(:transfer) do
        FactoryBot.create(:transfer, to_transaction: transaction_entry)
      end

      it "returns the correct serialized data" do
        expect(subject.render).to eq(
          "key" => entry_key,
          "amount" => detail_amount,
          "clearanceDate" => interval.first_date.strftime("%F"),
          "checkNumber" => check_number.to_s,
          "description" => description,
          "notes" => notes,
          "isBudgetExclusion" => false,
          "details" => [
            {
              "amount" => detail_amount,
              "iconClassName" => nil,
              "budgetItemKey" => nil,
              "budgetCategoryName" => nil,
              "key" => detail_key,
            },
          ],
          "updatedAt" => transaction_entry.updated_at.strftime("%FT%TZ"),
          "transferKey" => transfer.key
        )
      end
    end

    context "when a budget exclusion" do
      subject { described_class.new(transaction_entry) }

      let(:account) { FactoryBot.create(:savings_account) }
      let(:transaction_entry) do
        FactoryBot.create(:transaction_entry, :budget_exclusion, account: account)
      end

      it "returns true for budget exclusion, false for transfer" do
        subject.render.then do |rendered|
          expect(rendered).to include("isBudgetExclusion" => true)
          expect(rendered).not_to have_key("transferKey")
        end
      end
    end
  end
end
