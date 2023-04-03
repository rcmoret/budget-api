require "rails_helper"

RSpec.describe Presenters::Budget::MonthlyItemPresenter do
  describe "#remaining" do
    subject { described_class.new(item_double) }

    context "when there are no transaction details" do
      let(:item_double) { instance_double(Budget::Item, transaction_detail_count: 0, amount: rand(-100_00..-100)) }

      it "returns the difference" do
        expect(subject.remaining).to be item_double.amount
      end
    end

    context "when difference is positive" do
      let(:item_double) { instance_double(Budget::Item, transaction_detail_count: 1, amount: rand(-100_00..-100)) }

      it "returns the difference" do
        expect(subject.remaining).to be_zero
      end
    end
  end

  describe "#reviewable?" do
    subject { described_class.new(item_double) }

    context "when the item is deletable" do
      let(:item_double) { instance_double(Budget::Item, deletable?: true) }

      it "returns true" do
        expect(subject.reviewable?).to be true
      end
    end

    context "when the item is not deletable" do
      let(:item_double) { instance_double(Budget::Item, deletable?: false) }

      it "returns false" do
        expect(subject.reviewable?).to be false
      end
    end
  end

  describe "#budget_impact" do
    subject { described_class.new(item_double) }

    context "when the item has no transaction details" do
      let(:item_double) { instance_double(Budget::Item, transaction_detail_count: 0) }

      it "returns -1 times the difference" do
        expect(subject.budget_impact).to be_zero
      end
    end

    context "when the item has a transaction detail" do
      let(:item_double) do
        instance_double(Budget::Item, difference: rand(100..100_00), transaction_detail_count: 1)
      end

      it "returns zero" do
        expect(subject.budget_impact).to be(-item_double.difference)
      end
    end
  end
end
