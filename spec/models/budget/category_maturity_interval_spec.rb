require "rails_helper"

RSpec.describe Budget::CategoryMaturityInterval do
  it { is_expected.to delegate_method(:month).to(:interval) }
  it { is_expected.to delegate_method(:year).to(:interval) }

  describe "belongs to" do
    subject { described_class.new(category:, interval:) }

    let(:category) { create(:category, :accrual) }
    let(:interval) { create(:budget_interval) }

    it { is_expected.to belong_to(:interval) }
  end

  describe "requires interval and catgory" do
    context "when the budget interval is null" do
      subject { described_class.new(category:, interval: nil) }

      let(:category) { create(:category, :accrual) }

      it "raises an error" do
        expect { subject.save! }.to raise_error ActiveRecord::RecordInvalid
      end
    end

    context "when the budget category is null" do
      subject { described_class.new(category: nil, interval:) }

      let(:interval) { create(:budget_interval) }

      it "raises an error" do
        expect { subject.save! }.to raise_error NoMethodError
      end
    end
  end

  describe "uniqueness validation" do
    subject { record.valid? }

    let(:interval) { create(:budget_interval) }
    let(:category) { create(:category, :accrual) }
    let(:record) do
      build(:maturity_interval, interval:, category:)
    end

    before do
      create(:maturity_interval, interval:, category:)
    end

    it "returns false" do
      expect(subject).to be false
    end
  end

  describe "accrual validation" do
    subject { record.valid? }

    context "when the category is not an accrual" do
      let(:interval) { build(:budget_interval) }
      let(:category) { build(:category) }
      let(:record) do
        described_class.new(interval:, category:)
      end

      it "returns false" do
        expect(subject).to be false
      end
    end

    context "when the category is an accrual" do
      let(:interval) { build(:budget_interval) }
      let(:category) { build(:category, :accrual) }
      let(:record) do
        described_class.new(interval:, category:)
      end

      it "returns true" do
        expect(subject).to be true
      end
    end
  end
end
