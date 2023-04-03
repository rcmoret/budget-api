require "rails_helper"

RSpec.describe Budget::Item, type: :model do
  xit { is_expected.to belong_to(:category).required }
  xit { is_expected.to belong_to(:interval).required }
  it { is_expected.to have_many(:transaction_details) }
  it { is_expected.to delegate_method(:name).to(:category) }
  it { is_expected.to delegate_method(:icon_class_name).to(:category) }
  it { is_expected.to delegate_method(:expense?).to(:category) }
  it { is_expected.to delegate_method(:monthly?).to(:category) }

  describe "validation of uniqueness for weekly items per interval" do
    specify do
      budget_interval = FactoryBot.create(:budget_interval)
      category = FactoryBot.create(:category, :weekly)
      FactoryBot.create(:budget_item, category: category, interval: budget_interval)

      subject = FactoryBot.build(:budget_item, category: category, interval: budget_interval)

      expect(subject).to be_invalid
    end
  end

  context "when deleting an item" do
    around do |ex|
      freeze_time { ex.run }
    end

    context "when transaction details are present" do
      it "raises an error" do
        transaction_detail = FactoryBot.create(:transaction_detail)
        subject = transaction_detail.budget_item

        expect { subject.delete }.to raise_error(described_class::NonDeleteableError)
      end
    end

    context "when transaction details are not present" do
      it "updates the deleted at time stamp" do
        subject = FactoryBot.create(:budget_item)

        expect { subject.delete }
          .to(change { subject.reload.deleted_at }.from(nil).to(Time.current))
      end
    end
  end

  describe "#deletable?" do
    subject { budget_item.deletable? }

    let(:budget_item) { FactoryBot.create(:budget_item) }

    context "when the budget item has no transaction details" do
      it "returns true" do
        expect(subject).to be true
      end
    end

    context "when the budget item has at least one transaction detail" do
      before { FactoryBot.create(:transaction_detail, budget_item: budget_item) }

      it "returns false" do
        expect(subject).to be false
      end
    end
  end

  describe "#amount" do
    subject { budget_item }

    let(:budget_item) { FactoryBot.create(:budget_item) }

    context "when the budget item has no events" do
      it "returns zero" do
        expect(subject.amount).to be_zero
      end
    end

    context "when the budget item has at least one event" do
      let!(:budget_item_event) { FactoryBot.create(:budget_item_event, item: budget_item) }

      it "returns the total of the details' amounts" do
        expect(subject.amount).to be budget_item_event.amount
      end
    end
  end

  describe "#transaction_detail_count" do
    subject { FactoryBot.create(:weekly_item) }

    context "when there are no details" do
      it "returns zero" do
        expect(subject.transaction_detail_count).to be_zero
      end
    end

    context "when there are serveral details" do
      let(:count) { rand(1..10) }

      before { FactoryBot.create_list(:transaction_detail, count, budget_item: subject) }

      it "returns the count" do
        expect(subject.transaction_detail_count).to be count
      end
    end
  end

  describe "#spent" do
    subject { FactoryBot.create(:weekly_item) }

    context "when there are no details" do
      it "returns zero" do
        expect(subject.spent).to be_zero
      end
    end

    context "when there are serveral details" do
      let(:count) { rand(1..10) }

      let!(:details) { FactoryBot.create_list(:transaction_detail, count, budget_item: subject) }

      it "returns the count" do
        expect(subject.spent).to be details.map(&:amount).sum
      end
    end
  end

  describe "#difference" do
    subject { FactoryBot.create(:weekly_expense) }

    before { FactoryBot.create(:budget_item_event, :create_event, amount: rand(-100_00..-10_00)) }

    context "when there are no details" do
      it "returns zero" do
        expect(subject.difference).to be subject.amount
      end
    end

    context "when there are serveral details" do
      let(:count) { rand(1..10) }
      let!(:details) { FactoryBot.create_list(:transaction_detail, count, budget_item: subject) }

      it "returns the count" do
        expect(subject.difference)
          .to be(subject.amount - details.sum(&:amount))
      end
    end
  end
end
