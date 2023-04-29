require "rails_helper"

RSpec.describe Forms::Budget::FinalizeIntervalForm do
  describe "#save" do
    subject do
      described_class.new(user: user, interval: interval, events: events, **optional_args)
    end

    let(:optional_args) { {} }

    context "when the interval is closed out" do
      let(:user) { FactoryBot.create(:user) }
      let(:interval) { FactoryBot.create(:budget_interval, :closed_out, user_group: user.group) }
      let(:events) { [] }
      let(:form_double) { instance_double(Forms::Budget::EventsForm, valid?: true) }

      before do
        allow(Forms::Budget::EventsForm).to receive(:new).and_return(form_double)
      end

      it "returns false and the form has errors" do
        expect(form_double).not_to receive(:save)
        expect(subject.save).to be false
        expect(subject.errors[:interval]).to eq ["has already been finalized"]
      end
    end

    context "when the interval is not closed out" do
      let(:user) { FactoryBot.create(:user) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
      let(:category) { FactoryBot.create(:category, :expense, user_group: user.group) }
      let(:amount) { rand(-100_00..-100) }
      let(:events) do
        [
          {
            amount: amount,
            month: interval.month,
            year: interval.year,
            budget_category_key: category.key,
            event_type: Budget::EventTypes::CREATE_EVENTS.sample,
            budget_item_key: SecureRandom.hex(6),
          },
        ]
      end

      around { |ex| travel_to(Time.current.beginning_of_minute) { ex.run } }

      it "returns true" do
        expect(subject.save).to be true
      end

      it "updates the close out time, creates events" do
        expect { subject.save }
          .to change { Budget::Item.count }
          .by(+1)
          .and change { Budget::ItemEvent.count }
          .by(+1)
          .and change { interval.reload.close_out_completed_at }
          .from(nil)
          .to(Time.current)
      end
    end
  end
end
