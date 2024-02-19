require "rails_helper"

RSpec.describe Budget::Events::SetupForm do
  let(:user) { create(:user) }

  describe "interval not setup validation" do
    before do
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(instance_double(Forms::Budget::EventsForm, valid?: true, save: true))
    end

    let(:interval) { create(:budget_interval, :set_up, user_group: user.group) }

    it "records an error" do
      events_params = [{ event_type: valid_create_event }]
      form = described_class.new(user: user, interval: interval, events: events_params)

      expect(form.save).to be false
      expect(form.errors["interval"]).to include "has already been set up"
    end
  end

  describe "events form validation" do
    subject { described_class.new(user: user, interval: interval, events: events_params) }

    before do
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(events_form_double)
    end

    let(:interval) { create(:budget_interval) }
    let(:errors_double) do
      instance_double(ActiveModel::Errors).tap do |double|
        allow(double).to receive(:each).and_yield(error_double)
      end
    end
    let(:error_double) do
      instance_double(ActiveModel::Error, attribute: "event_type", full_message: "No registered handler")
    end
    let(:events_form_double) do
      instance_double(Forms::Budget::EventsForm, valid?: false, errors: errors_double)
    end
    let(:events_params) { [{ event_type: valid_create_event }] }

    it "returns false" do
      expect(subject.save).to be false
    end

    it "has the promoted errors" do
      subject.save

      expect(subject.errors["event_type"]).to include "No registered handler"
    end
  end

  context "when the form does not save correctly" do
    subject { described_class.new(user: user, interval: interval, events: events_params) }

    before do
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(form_double)
    end

    let(:user) { create(:user) }
    let(:interval) do
      create(:budget_interval, user_group: user.user_group)
    end
    let(:errors_double) do
      instance_double(ActiveModel::Errors).tap do |double|
        allow(double).to receive(:each).and_yield(error_double)
      end
    end
    let(:error_double) do
      instance_double(ActiveModel::Error, attribute: "create.0.amount", full_message: "Can't be blank")
    end
    let(:form_double) do
      instance_double(Forms::Budget::EventsForm, valid?: true, save: false, errors: errors_double)
    end
    let(:events_params) { [{ event_type: valid_create_event }] }

    it "returns false, has the promoted errors" do
      expect(subject.save).to be false
      expect(subject.errors["create.0.amount"]).to include "Can't be blank"
    end
  end

  describe "updates to the interval" do
    subject do
      described_class.new(user: user, interval: interval, events: events_params)
    end

    before do
      travel_to(Time.current.beginning_of_minute)
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(instance_double(Forms::Budget::EventsForm, save: true, valid?: true))
    end

    let(:user) { create(:user) }
    let(:user_group) { user.user_group }
    let(:interval) { create(:budget_interval, user_group: user_group, month: month, year: year) }
    let(:events_params) { [{ event_type: valid_create_event }] }

    it "updates the interval's set up completed at timestamp" do
      expect { subject.save }
        .to change { interval.reload.set_up_completed_at }
        .from(nil)
        .to(Time.current)
    end

    context "when the start and end dates are not populated and no info is passed in" do
      it "updates the interval's start date" do
        expect { subject.save }
          .to change { interval.reload.start_date }
          .from(nil)
          .to(interval.prev.last_date + 1.day)
      end

      it "updates the interval's end date" do
        expect { subject.save }
          .to change { interval.reload.end_date }
          .from(nil)
          .to(interval.last_date)
      end
    end

    context "when the start and end dates are pre-popluated" do
      let(:today) { Time.zone.today }
      let(:interval) do
        create(:budget_interval,
               user_group: user.user_group,
               start_date: Date.new(today.year, today.month, 2),
               end_date: Date.new(today.year, today.month, -2),)
      end

      it "does not change the interval's start date" do
        expect { subject.save }.not_to(change { interval.reload.start_date })
      end

      it "does not change the interval's end date" do
        expect { subject.save }.not_to(change { interval.reload.end_date })
      end
    end

    context "when the start and end dates are not populated and values are provided" do
      subject do
        described_class.new(
          user: interval.user_group.users.first,
          interval: interval,
          events: events_params,
          start_date: start_date,
          end_date: end_date,
        )
      end

      let(:today) { Time.zone.today }
      let(:start_date) { DateTime.new(today.year, today.month, 2) }
      let(:end_date) { DateTime.new(today.year, today.month, -2) }

      it "updates the interval's start date" do
        expect { subject.save }
          .to change { interval.reload.start_date }
          .from(nil)
          .to(start_date)
      end

      it "updates the interval's end date" do
        expect { subject.save }
          .to change { interval.reload.end_date }
          .from(nil)
          .to(end_date)
      end
    end
  end

  describe "initializing and saving the events form" do
    subject { described_class.new(user: user, interval: interval, events: events_params) }

    before do
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(form_double)
    end

    let(:form_double) { instance_double(Forms::Budget::EventsForm, valid?: true, save: true) }
    let(:events_params) { [{ event_type: valid_create_event }] }
    let(:interval) { create(:budget_interval) }

    it "initializes the events form" do
      expect(Forms::Budget::EventsForm)
        .to receive(:new)
        .with(user, events: events_params)
      subject.save
    end

    it "checks the forms validity" do
      expect(form_double).to receive(:valid?)

      subject.save
    end

    it "calls save on the form" do
      expect(form_double).to receive(:save)

      subject.save
    end
  end

  describe ".save" do
    subject { described_class.new(user: user, interval: interval, events: []) }

    before do
      allow(Forms::Budget::EventsForm)
        .to receive(:new)
        .and_return(form_double)
    end

    let(:form_double) { instance_double(Forms::Budget::EventsForm, valid?: true, save: true) }
    let(:interval) { create(:budget_interval) }

    it "returns true" do
      expect(subject.save).to be true
    end
  end

  def valid_create_event
    Budget::EventTypes::CREATE_EVENTS.sample
  end

  def month
    (1..12).to_a.sample
  end

  def year
    2000 + (20..31).to_a.sample
  end
end
