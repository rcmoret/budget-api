require "rails_helper"

RSpec.describe API::Budget::Items::EventsResponseSerializer do
  subject do
    described_class.new(user: user, interval: interval, budget_item_keys: budget_item_keys)
  end

  describe "#discretionary" do
    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }
    let(:budget_item_keys) { [] }

    it "calls the disretionary serializer" do
      expect(API::Budget::Interval::DiscretionarySerializer)
        .to receive(:new)
        .with(interval)

      subject.discretionary
    end
  end

  describe "#items" do
    let(:user) { create(:user) }
    let(:category1) { create(:category, user_group: user.group) }
    let(:category2) { create(:category, user_group: user.group) }
    let(:category3) { create(:category, user_group: user.group) }
    let(:budget_item1) { create(:budget_item, category: category1) }
    let(:budget_item2) { create(:budget_item, category: category2) }
    let(:budget_item3) { create(:budget_item, category: category3) }

    let(:interval) { instance_double(API::Budget::Interval) }
    let(:budget_items) do
      [budget_item1, budget_item2, budget_item3]
    end
    let(:budget_item_keys) { budget_items.map(&:key) }

    it "returns the decorated items" do
      expect(API::Budget::Items::ItemSerializer).to receive(:new).exactly(3).times

      subject.items
    end
  end
end
