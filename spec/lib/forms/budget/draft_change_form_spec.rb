require "rails_helper"

RSpec.describe Forms::Budget::DraftChangeForm do
  subject do
    described_class.new(
      interval,
      budget_item_key: budget_item_key,
      budget_category_key: budget_category_key,
      amount: amount,
    )
  end

  let(:user_group) { create(:user_group) }
  let(:interval) { create(:budget_interval, user_group: user_group) }

  describe "amount validations" do
    let(:category) { create(:category, user_group: user_group) }
    let(:item) { create(:budget_item, category: category, interval: interval) }
    let(:budget_category_key) { category.key }
    let(:budget_item_key) { item.key }

    context "when passing an amount of `nil`" do
      let(:amount) { nil }

      it "is invalid; returns an error" do
        expect(subject.valid?).to be false
        expect(subject.errors[:amount]).to include "is not a number"
      end
    end

    context "when passing a float" do
      let(:amount) { 1.5 }

      it "is invalid; returns an error" do
        expect(subject.valid?).to be false
        expect(subject.errors[:amount]).to include "must be an integer"
      end
    end
  end

  describe "category validations" do
    before do
      allow(Budget::Category).to receive(:fetch).and_return(nil)
    end

    let(:budget_category_key) { SecureRandom.hex(6) }
    let(:budget_item_key) { SecureRandom.hex(6) }
    let(:amount) { 20_00 }

    it "is invalid; returns an error" do
      expect(subject.valid?).to be false
      expect(subject.errors[:category_id]).to eq ["can't be blank"]
    end
  end

  describe "the public methods" do
    let(:category) { create(:category, user_group: user_group) }
    let(:item) { create(:budget_item, category: category, interval: interval) }
    let(:budget_category_key) { category.key }
    let(:budget_item_key) { item.key }
    let(:amount) { 55_00 }

    it "returns the expect values" do
      expect(subject.category_id).to eq category.id
      expect(subject.budget_item_key).to eq budget_item_key
      expect(subject.amount).to be amount
      expect(subject.interval).to eq interval
    end
  end
end
