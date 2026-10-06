require "rails_helper"

RSpec.describe Presenters::Budget::DayToDayExpensePresenter do
  describe "#remaining" do
    subject { described_class.new(item_double) }

    context "when difference is negative" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(-100_00..-100))
      end

      it "returns the difference" do
        expect(subject.remaining).to be item_double.difference
      end
    end

    context "when difference is positive" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(100..100_00))
      end

      it "returns the difference" do
        expect(subject.remaining).to be_zero
      end
    end
  end

  describe "#reviewable?" do
    subject { described_class.new(item_double) }

    context "when difference is negative" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(-100_00..-100))
      end

      it "returns true" do
        expect(subject.reviewable?).to be true
      end
    end

    context "when difference is positive" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(100..100_00))
      end

      it "returns false" do
        expect(subject.reviewable?).to be false
      end
    end
  end

  describe "#budget_impact" do
    subject { described_class.new(item_double) }

    context "when difference is negative" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(-100_00..-100))
      end

      it "returns zero" do
        expect(subject.budget_impact).to be_zero
      end
    end

    context "when difference is positive" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(100..100_00))
      end

      it "returns -1 times the difference" do
        expect(subject.budget_impact).to be(-item_double.difference)
      end
    end
  end
end
