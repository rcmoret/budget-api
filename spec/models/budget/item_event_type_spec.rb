require "rails_helper"

RSpec.describe Budget::ItemEventType do
  describe "name format validation" do
    context "when the name is underscored lowercase string no numbers" do
      it "is valid" do
        name = Budget::EventTypes::VALID_EVENT_TYPES.sample
        object = described_class.for(name)
        expect(object).to be_valid
      end
    end

    context "with a space" do
      it "is invalid" do
        name = "item create"
        object = described_class.new(name: name)
        expect(object).not_to be_valid
      end
    end
  end
end
