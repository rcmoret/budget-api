require "rails_helper"

RSpec.describe Budget::Intervals::EventSerializer do
  describe "#render" do
    subject { described_class.new(budget_item_event) }

    let(:event_description) { Budget::EventTypes::VALID_EVENT_TYPES.sample }
    let(:budget_item_event_type) { Budget::ItemEventType.for(event_description) }
    let(:budget_item_event) do
      FactoryBot.create(:budget_item_event, type: budget_item_event_type)
    end

    it "returns the attributes as a hash" do
      expect(subject.render).to eq(
        "typeName" => event_description,
        "key" => budget_item_event.key,
        "amount" => budget_item_event.amount,
        "data" => budget_item_event.data,
        "createdAt" => budget_item_event.created_at.strftime("%FT%TZ")
      )
    end
  end
end
