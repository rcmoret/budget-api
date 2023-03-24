require "rails_helper"

RSpec.describe Budget::Events::SetupForm do
  let(:user) { FactoryBot.create(:user) }

  describe "interval presence validation" do
    before do
      allow(Budget::Interval)
        .to receive(:for)
        .and_return(instance_double(Budget::Interval, persisted?: false, set_up?: false))
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(instance_double(Budget::Events::Form, valid?: true, save: true))
    end

    it "records an error" do
      events_params = [{ event_type: valid_create_event }]
      form = described_class.new(month: month, year: year, user: user, events: events_params)

      form.save

      expect(form.errors["interval"]).to include "must be present and valid"
    end

    it "returns false" do
      events_params = [{ event_type: valid_create_event }]
      form = described_class.new(user: user, month: month, year: year, events: events_params)
      expect(form.save).to be false
    end
  end

  describe "interval not setup validation" do
    before do
      interval_double = instance_double(
        Budget::Interval,
        persisted?: true,
        set_up?: true,
      )
      allow(Budget::Interval)
        .to receive(:for)
        .and_return(interval_double)
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(instance_double(Budget::Events::Form, valid?: true, save: true))
    end

    it "records an error" do
      events_params = [{ event_type: valid_create_event }]
      form = described_class.new(user: user, month: month, year: year, events: events_params)

      form.save

      expect(form.errors["interval"]).to include "has already been set up"
    end

    it "returns false" do
      events_params = [{ event_type: valid_create_event }]
      form = described_class.new(user: user, month: month, year: year, events: events_params)
      expect(form.save).to be false
    end
  end

  describe "events form validation" do
    subject { described_class.new(user: user, month: month, year: year, events: events_params) }

    before do
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(events_form_double)
    end

    let(:errors_double) do
      instance_double(ActiveModel::Errors).tap do |double|
        allow(double).to receive(:each).and_yield(error_double)
      end
    end
    let(:error_double) do
      instance_double(ActiveModel::Error, attribute: "event_type", full_message: "No registered handler")
    end
    let(:events_form_double) do
      instance_double(Budget::Events::Form, valid?: false, errors: errors_double)
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
    subject { described_class.new(user: user, month: month, year: year, events: events_params) }

    before do
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(form_double)
      FactoryBot.create(:budget_interval, user_group: user.user_group, month: month, year: year)
    end

    let(:user) { FactoryBot.create(:user) }
    let(:errors_double) do
      instance_double(ActiveModel::Errors).tap do |double|
        allow(double).to receive(:each).and_yield(error_double)
      end
    end
    let(:error_double) do
      instance_double(ActiveModel::Error, attribute: "create.0.amount", full_message: "Can't be blank")
    end
    let(:form_double) do
      instance_double(Budget::Events::Form, valid?: true, save: false, errors: errors_double)
    end
    let(:events_params) { [{ event_type: valid_create_event }] }

    it "returns false" do
      expect(subject.save).to be false
    end

    it "has the promoted errors" do
      subject.save

      expect(subject.errors["create.0.amount"]).to include "Can't be blank"
    end
  end

  describe "updates to the interval" do
    subject do
      described_class.new(user: user, month: interval.month, year: interval.year, events: events_params)
    end

    around { |ex| travel_to(Time.current.beginning_of_minute) { ex.run } }

    before do
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(instance_double(Budget::Events::Form, save: true, valid?: true))
    end

    let(:user) { FactoryBot.create(:user) }
    let(:user_group) { user.user_group }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group, month: month, year: year) }
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
        FactoryBot.create(:budget_interval,
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
          month: interval.month,
          year: interval.year,
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
    subject { described_class.new(user: user, month: month, year: year, events: events_params) }

    before do
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(form_double)
    end

    let(:form_double) { instance_double(Budget::Events::Form, valid?: true, save: true) }
    let(:events_params) { [{ event_type: valid_create_event }] }

    it "initializes the events form" do
      expect(Budget::Events::Form)
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
    subject { described_class.new(user: user, month: month, year: year, events: []) }

    before do
      allow(Budget::Events::Form)
        .to receive(:new)
        .and_return(form_double)
    end

    let(:form_double) { instance_double(Budget::Events::Form, valid?: true, save: true) }

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
