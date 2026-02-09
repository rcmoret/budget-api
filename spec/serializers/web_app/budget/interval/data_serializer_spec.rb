require "rails_helper"

RSpec.describe WebApp::Budget::Interval::DataSerializer do
  describe "#total_days" do
    subject { described_class.new(interval) }

    let(:user) { create(:user) }
    let(:interval) { create(:budget_interval, user_group: user.group) }

    it "returns the difference + 1" do
      expect(subject.total_days)
        .to eq((interval.last_date - interval.first_date).to_i + 1)
    end
  end

  describe "#days_remaining" do
    subject { described_class.new(interval) }

    let(:user) { create(:user) }
    let(:interval) do
      create(
        :budget_interval,
        user_group: user.group,
        start_date: Date.new(2022, 3, 1),
        end_date: Date.new(2022, 3, 31)
      )
    end

    context "when in the interval is in the past" do
      before { travel_to(Date.new(2022, 4, 20)) }

      it "returns zero" do
        expect(subject.days_remaining).to be_zero
      end
    end

    context "when in the interval is in the future" do
      before { travel_to(Date.new(2022, 1, 30)) }

      it "returns the total number of days" do
        expect(subject.days_remaining).to be 31
      end
    end

    context "when the interval is current" do
      before { travel_to(Date.new(2022, 3, 10)) }

      it "returns the difference + 1" do
        expect(subject.days_remaining).to be 22
      end
    end
  end
end
