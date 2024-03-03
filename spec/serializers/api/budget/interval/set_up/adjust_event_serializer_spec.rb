require "rails_helper"

RSpec.describe API::Budget::Interval::SetUp::AdjustEventSerializer do
  describe "delegated methods" do
    subject { described_class.new(budget_item) }

    let(:icon) { create(:icon) }
    let(:category) { create(:category, icon: icon) }
    let(:budget_item) { create(:budget_item, category: category) }

    before { allow(SecureRandom).to receive(:hex).and_call_original }

    it "delegates the follow methods" do
      expect(subject.name).to eq category.name
      expect(subject.icon_class_name).to eq icon.class_name
      expect(subject.amount).to eq budget_item.amount
      expect(subject.budgeted).to eq budget_item.amount
      expect(subject.budget_item_key).to eq budget_item.key
      expect(subject.spent).to eq budget_item.spent
      expect(subject.event_type).to eq Budget::EventTypes::SETUP_ITEM_ADJUST
      expect(subject.data).to eq({})
      expect(SecureRandom).to receive(:hex).once
      subject.event_key
      subject.render
    end
  end
end
