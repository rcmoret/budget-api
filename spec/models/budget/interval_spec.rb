require "rails_helper"

RSpec.describe Budget::Interval, type: :model do
  it { is_expected.to have_many(:items) }

  describe ".current" do
    context "when late March 2023" do
      let(:user) { FactoryBot.create(:user) }

      before do
        FactoryBot.create(
          :budget_interval,
          user_group: user.group,
          close_out_completed_at: 1.minute.ago,
          start_date: Date.new(2023, 3, 2),
          end_date: Date.new(2023, 3, 30),
          month: 3,
          year: 2023
        )
      end

      context "when in the middle of the month" do
        around do |ex|
          travel_to(Date.new(2023, 3, 30)) { ex.run }
        end

        it "returns the interval for March 2023" do
          subject = described_class.belonging_to(user).current
          expect(subject.month).to be 3
          expect(subject.year).to be 2023
        end
      end

      context "when at the end of the calendar month is part of the next month" do
        around do |ex|
          travel_to(Date.new(2023, 3, 31)) { ex.run }
        end

        it "returns the interval for April 2023" do
          subject = described_class.belonging_to(user).current
          expect(subject.month).to be 4
          expect(subject.year).to be 2023
        end
      end

      context "when at the start of the calendar month is part of the previous month" do
        around do |ex|
          travel_to(Date.new(2023, 3, 1)) { ex.run }
        end

        it "returns the interval for Feb 2023" do
          subject = described_class.belonging_to(user).current
          expect(subject.month).to be 2
          expect(subject.year).to be 2023
        end
      end
    end
  end

  describe "month validations" do
    context "when the month is nil" do
      specify do
        subject = FactoryBot.build(:budget_interval, month: nil)

        expect(subject).to be_invalid
      end
    end

    context "when the month is greater than 12" do
      specify do
        subject = FactoryBot.build(:budget_interval, month: 13)

        expect(subject).to be_invalid
      end
    end

    context "when the month is less than 1" do
      specify do
        subject = FactoryBot.build(:budget_interval, month: 0)

        expect(subject).to be_invalid
      end
    end

    context "when the month is 1-12" do
      specify do
        subject = FactoryBot.build(:budget_interval, month: (1..12).to_a.sample)

        expect(subject).to be_valid
      end
    end
  end

  describe "year validations" do
    context "when the year is nil" do
      specify do
        subject = FactoryBot.build(:budget_interval, year: nil)

        expect(subject).to be_invalid
      end
    end

    context "when the year is too early" do # 1990's gtfo
      specify do
        subject = FactoryBot.build(:budget_interval, year: 1999)

        expect(subject).to be_invalid
      end
    end

    context "when the year is too late" do # if we live that long
      specify do
        subject = FactoryBot.build(:budget_interval, year: 2100)

        expect(subject).to be_invalid
      end
    end

    context "when the year is valid" do
      specify do
        subject = FactoryBot.build(:budget_interval, year: (2000..2099).to_a.sample)

        expect(subject).to be_valid
      end
    end
  end

  describe "#first_date" do
    context "when the first day lands normally" do # (2/28/19 is a Thursday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 3, year: 2019)
        expect(subject.first_date).to eq Date.new(2019, 3, 1)
      end
    end

    context "when the first day lands on a Sunday" do # (8/1/21 is a Sunday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 8, year: 2021)
        expect(subject.first_date).to eq Date.new(2021, 7, 30)
      end
    end

    context "when the first day lands on a Saturday" do # (5/1/21 is a Saturday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 5, year: 2021)
        expect(subject.first_date).to eq Date.new(2021, 4, 30)
      end
    end

    context "when the first is New Year's Day" do # (1/1/24 is a Monday which is an edge case)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 1, year: 2024)
        expect(subject.first_date).to eq Date.new(2023, 12, 29)
      end
    end

    context "when the first is a Monday and Labor Day" do # (9/1/25 is a Monday which is an edge case)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 9, year: 2025)
        expect(subject.first_date).to eq Date.new(2025, 8, 29)
      end
    end

    context "when the Labor Day lands on a non-Monday" do # (9/1/22 is a Thursday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 9, year: 2022)
        expect(subject.first_date).to eq Date.new(2022, 9, 1)
      end
    end
  end

  describe "#last_date" do
    context "when the last day lands normally" do
      specify do
        subject = FactoryBot.build(:budget_interval, month: 2, year: 2019)
        expect(subject.last_date).to eq Date.new(2019, 2, 28)
      end
    end

    context "when the first day of the next month lands on a Sunday" do # (8/1/21 is a Sunday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 7, year: 2021)
        expect(subject.last_date).to eq Date.new(2021, 7, 29)
      end
    end

    context "when the first day of the next month lands on a Saturday" do # (5/1/21 is a Saturday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 4, year: 2021)
        expect(subject.last_date).to eq Date.new(2021, 4, 29)
      end
    end

    context "when the first of the next month is New Year's Day" do # (1/1/24 is a Monday)
      specify do
        subject = FactoryBot.build(:budget_interval, month: 12, year: 2023)
        expect(subject.last_date).to eq Date.new(2023, 12, 28)
      end
    end
  end

  describe "#current?" do
    subject do
      FactoryBot.create(
        :budget_interval,
        start_date: Date.new(2023, 3, 2),
        end_date: Date.new(2023, 3, 30),
        month: 3,
        year: 2023
      )
    end

    context "when on the start date" do
      around { |ex| travel_to(Date.new(2023, 3, 2)) { ex.run } }

      specify { expect(subject.current?).to be true }
    end

    context "when on the end date" do
      around { |ex| travel_to(Date.new(2023, 3, 30)) { ex.run } }

      specify { expect(subject.current?).to be true }
    end

    context "when in the middle of the month" do
      around { |ex| travel_to(Date.new(2023, 3, rand(3..29))) { ex.run } }

      specify { expect(subject.current?).to be true }
    end

    context "when after the month" do
      around { |ex| travel_to(Date.new(2023, 3, 31)) { ex.run } }

      specify { expect(subject.current?).to be false }
    end

    context "when before the month" do
      around { |ex| travel_to(Date.new(2023, 3, 1)) { ex.run } }

      specify { expect(subject.current?).to be false }
    end
  end

  describe "#past?" do
    subject do
      FactoryBot.create(
        :budget_interval,
        start_date: Date.new(2023, 3, 2),
        end_date: Date.new(2023, 3, 30),
        month: 3,
        year: 2023
      )
    end

    context "when today is greater than the interval's end date" do
      around { |ex| travel_to(Date.new(2023, 3, 31)) { ex.run } }

      specify { expect(subject.past?).to be true }
    end

    context "when today is less than the interval's start date" do
      around { |ex| travel_to(Date.new(2023, 3, 1)) { ex.run } }

      specify { expect(subject.past?).to be false }
    end
  end

  describe "#future?" do
    subject do
      FactoryBot.create(
        :budget_interval,
        start_date: Date.new(2023, 3, 2),
        end_date: Date.new(2023, 3, 30),
        month: 3,
        year: 2023
      )
    end

    context "when today is greater than the interval's end date" do
      around { |ex| travel_to(Date.new(2023, 3, 31)) { ex.run } }

      specify { expect(subject.future?).to be false }
    end

    context "when today is less than the interval's start date" do
      around { |ex| travel_to(Date.new(2023, 3, 1)) { ex.run } }

      specify { expect(subject.future?).to be true }
    end
  end
end
