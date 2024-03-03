require "rails_helper"

RSpec.describe API::Budget::Items::ItemSerializer do
  describe "delegated methods" do
    subject { described_class.new(budget_item) }

    let(:category) { create(:category, :with_icon) }
    let(:budget_item) { create(:budget_item, category: category).decorated }

    it "delegates most methods" do
      expect(subject.key).to eq budget_item.key
      expect(subject.name).to eq category.name
      expect(subject.amount).to eq budget_item.amount
      expect(subject.key).to eq budget_item.key
      expect(subject.difference).to eq budget_item.difference
      expect(subject.remaining).to eq budget_item.remaining
      expect(subject.spent).to eq budget_item.spent
      expect(subject.is_accrual).to eq category.accrual?
      expect(subject.is_deletable).to eq budget_item.deletable?
      expect(subject.is_monthly).to eq budget_item.monthly?
      expect(subject.is_per_diem_enabled).to eq category.per_diem_enabled?
      expect(subject.icon_class_name).to eq category.icon_class_name
      expect(subject.budget_category_key).to eq category.key
    end
  end
end
