require "rails_helper"

RSpec.describe Budget::Events::DeleteItemForm do
  describe ".applies?" do # inherited from the base class but needs to be tested here
    context "when an applicable event" do
      it "returns true" do
        event_type = Budget::EventTypes::DELETE_EVENTS.sample
        expect(described_class.applies?(event_type)).to be true
      end
    end

    context "when a non-applicable event" do
      it "returns false" do
        event_type = Budget::EventTypes::CREATE_EVENTS.sample
        expect(described_class.applies?(event_type)).to be false
      end
    end
  end

  describe "validations" do
    let(:user) { create(:user) }
    let(:budget_interval) { create(:budget_interval, user_group: user.group) }
    let(:budget_category) { create(:category, user_group: user.group) }
    let(:budget_item) { create(:budget_item, category: budget_category, interval: budget_interval) }

    describe "event type validation" do
      context "when a valid event" do
        it "is a valid form object" do
          params = {
            budget_item_key: budget_item.key,
            event_type: Budget::EventTypes::DELETE_EVENTS.sample,
          }
          expect(described_class.new(user, params)).to be_valid
        end
      end

      context "when an invalid event" do
        it "is an invalid form object" do
          params = {
            event_type: "nonsense_event",
            budget_item_key: budget_item.key,
          }
          form = described_class.new(user, params)
          expect(form).not_to be_valid
          expect(form.errors["event_type"])
            .to include "is not included in the list"
        end
      end
    end

    describe "item validation" do
      let(:category) { create(:category, user_group: user.group) }
      let(:budget_item) { create(:budget_item, category: category) }

      context "when a budget item exists" do
        it "is a valid form object" do
          params = {
            budget_item_key: budget_item.key,
            event_type: Budget::EventTypes::DELETE_EVENTS.sample,
          }
          expect(described_class.new(user, params)).to be_valid
        end
      end

      context "when the budget item exists for the id passed" do
        it "is an invalid form object" do
          params = {
            budget_item_key: SecureRandom.hex(6),
            event_type: Budget::EventTypes::DELETE_EVENTS.sample,
          }
          form = described_class.new(user, params)
          expect(form).not_to be_valid
          expect(form.errors["budget_item"]).to include "can't be blank"
        end
      end
    end

    describe "item transacations validations" do
      context "when there is a transaction detail associated" do
        before { create(:transaction_detail, budget_item: budget_item) }

        let(:category) { create(:category, user_group: user.group) }
        let(:budget_item) { create(:budget_item, category: category) }

        it "is an invalid form object" do
          params = {
            budget_item_key: budget_item.key,
            event_type: Budget::EventTypes::DELETE_EVENTS.sample,
          }
          form = described_class.new(user, params)
          expect(form).not_to be_valid
          expect(form.errors["budget_item"]).to include "cannot delete an item with transaction details"
        end
      end
    end

    describe "cannot call a duplicate delete event" do
      it "is invalid" do
        create(:budget_item_event, :item_delete, item: budget_item, amount: 0)
        params = {
          budget_item_key: budget_item.key,
          event_type: Budget::EventTypes::DELETE_EVENTS.sample,
        }
        expect(described_class.new(user, params)).not_to be_valid
      end
    end
  end

  describe "save" do
    let(:user) { create(:user) }
    let(:category) { create(:category, user_group: user.group) }
    let(:budget_item) { create(:budget_item, category: category) }

    before { freeze_time }

    context "when the happy path" do
      it "returns true" do
        params = {
          budget_item_key: budget_item.key,
          event_type: Budget::EventTypes::DELETE_EVENTS.sample,
        }
        form = described_class.new(user, params)
        expect(form.save).to be true
      end

      it "updates the deleted at timestamp" do
        params = {
          budget_item_key: budget_item.key,
          event_type: Budget::EventTypes::DELETE_EVENTS.sample,
        }
        form = described_class.new(user, params)
        expect { form.save }
          .to(change { budget_item.reload.deleted_at }
          .from(nil)
          .to(Time.current))
      end

      it "creates an event record" do
        params = {
          budget_item_key: budget_item.key,
          event_type: Budget::EventTypes::DELETE_EVENTS.sample,
        }
        form = described_class.new(user, params)
        expect { form.save }.to(change { Budget::ItemEvent.delete_events.count }
          .from(0).to(+1))
      end
    end
  end
end
