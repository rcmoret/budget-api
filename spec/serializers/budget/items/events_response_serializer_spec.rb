require "rails_helper"

RSpec.describe Budget::Items::EventsResponseSerializer do
  subject do
    described_class.new(user: user, interval: interval, budget_item_keys: budget_item_keys)
  end

  describe "#discretionary" do
    let(:user) { FactoryBot.create(:user) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
    let(:budget_item_keys) { [] }

    it "calls the disretionary serializer" do
      expect(Budget::Intervals::DiscretionarySerializer)
        .to receive(:new)
        .with(interval)

      subject.discretionary
    end
  end

  describe "#items" do
    let(:user) { FactoryBot.create(:user) }
    let(:category1) { FactoryBot.create(:category, user_group: user.group) }
    let(:category2) { FactoryBot.create(:category, user_group: user.group) }
    let(:category3) { FactoryBot.create(:category, user_group: user.group) }
    let(:budget_item1) { FactoryBot.create(:budget_item, category: category1) }
    let(:budget_item2) { FactoryBot.create(:budget_item, category: category2) }
    let(:budget_item3) { FactoryBot.create(:budget_item, category: category3) }

    let(:interval) { instance_double(Budget::Interval) }
    let(:budget_items) do
      [budget_item1, budget_item2, budget_item3]
    end
    let(:budget_item_keys) { budget_items.map(&:key) }

    it "returns the decorated items" do
      expect(Budget::Items::ItemSerializer).to receive(:new).exactly(3).times

      subject.items
    end
  end
end
