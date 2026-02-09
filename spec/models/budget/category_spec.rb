require "rails_helper"

RSpec.describe Budget::Category do
  describe "associations" do
    it { is_expected.to have_many(:items) }
    it { is_expected.to have_many(:transaction_details) }
    it { is_expected.to belong_to(:icon).required(false) }
    it { is_expected.to have_many(:maturity_intervals) }
    it { is_expected.to have_many(:events).through(:items) }
  end

  describe "validations" do
    subject { create(:category) }

    it { is_expected.to validate_presence_of(:name) }

    it {
      expect(subject).to validate_uniqueness_of(:name).scoped_to(:user_group_id)
    }

    describe "accrual on expense" do
      subject { build(:category, :revenue, :accrual) }

      it { is_expected.not_to be_valid }

      it "populates the object's errors" do
        subject.valid?
        expect(subject.errors[:accrual]).to \
          include "can only be enabled for expenses"
      end
    end

    describe "expense/revenue cannot be changed after create" do
      subject { create(:category, :revenue) }

      it "returns false and the object has errors" do
        expect(subject.update(expense: true,
          default_amount: -10_00)).to be false
        expect(subject.errors.to_hash)
          .to eq(expense: [ "cannot be changed after creation" ])
      end
    end

    describe "monthly/day-to-day cannot be changed after create" do
      subject { create(:category, :monthly) }

      it "returns false and the object has errors" do
        expect(subject.update(monthly: false)).to be false
        expect(subject.errors.to_hash)
          .to eq(monthly: [ "cannot be changed after creation" ])
      end
    end
  end

  describe "#revenue?" do
    subject { category.revenue? }

    let(:category) { create(:category, expense?) }

    context "when category is revenue" do
      let(:expense?) { :revenue }

      it { is_expected.to be true }
    end

    context "when category is expense" do
      let(:expense?) { :expense }

      it { is_expected.to be false }
    end
  end

  describe "#weekly?" do
    subject { category.weekly? }

    let(:category) { create(:category, monthly: monthly?) }

    context "when category is weekly" do
      let(:monthly?) { false }

      it { is_expected.to be true }
    end

    context "when category is monthly" do
      let(:monthly?) { true }

      it { is_expected.to be false }
    end
  end

  describe "#archived?" do
    subject { category.archived? }

    let(:category) { create(:category, archived_at:) }

    context "when category was archived" do
      let(:archived_at) { 1.day.ago }

      it { is_expected.to be true }
    end

    context "when the category was not archived" do
      let(:archived_at) { nil }

      it { is_expected.to be false }
    end
  end

  describe "archiving/unarchiving" do
    before { freeze_time }

    let(:category) { create(:category) }

    describe "#archive!" do
      subject { category.archive! }

      before { allow(category).to receive(:update) }

      it "calls update" do
        expect(category).to receive(:update).with(archived_at: Time.current)
        subject
      end
    end

    describe "#unarchive!" do
      subject { category.unarchive! }

      before { allow(category).to receive(:update) }

      it "calls update" do
        expect(category).to receive(:update).with(archived_at: nil)
        subject
      end
    end
  end

  describe "destroy" do
    subject { category.destroy }

    before { freeze_time }

    let!(:category) { create(:category) }

    context "when there are no associated items" do
      it "deletes the record" do
        expect { subject }.to change { described_class.count }.by(-1)
      end
    end

    context "when there are associated items" do
      before do
        create(:budget_item, category:)
        allow(category).to receive(:update).and_call_original
      end

      it "soft deletes the record" do
        expect(category).to receive(:update).with(archived_at: Time.current)
        expect { subject }.not_to(change { described_class.count })
      end
    end
  end
end
