require "rails_helper"

RSpec.describe API::Budget::Interval::SetUp::CreateEventSerializer do
  describe "the following methods" do
    subject { described_class.new(budget_item, interval: interval) }

    let(:user_group) { create(:user_group) }
    let(:interval) { create(:budget_interval, user_group: user_group) }
    let(:category) { create(:category, user_group: user_group) }
    let(:budget_item) { create(:budget_item, category: category, interval: interval.prev) }

    before { allow(SecureRandom).to receive(:hex).and_call_original }

    it "does the following stuff" do
      expect(subject.amount).to be_zero
      expect(subject.budgeted).to be budget_item.amount
      expect(subject.spent).to be budget_item.spent
      expect(subject.event_type).to eq Budget::EventTypes::SETUP_ITEM_CREATE
      expect(subject.data).to eq({ "referencedFrom" => "budget item: #{budget_item.key}" })
      expect(SecureRandom).to receive(:hex).twice
      expect(subject.event_key).to match(/\A[a-f0-9-]{12}\z/)
      subject.budget_item_key
      subject.render
    end
  end
end
