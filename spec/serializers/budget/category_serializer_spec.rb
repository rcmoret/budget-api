require "rails_helper"

RSpec.describe Budget::CategorySerializer do
  describe "delegated methods" do
    subject { described_class.new(category) }

    let(:icon) { FactoryBot.create(:icon) }
    let(:category) { FactoryBot.build(:category, icon: icon) }

    it "delegate most methods" do
      expect(subject.key).to eq category.key
      expect(subject.slug).to eq category.slug
      expect(subject.name).to eq category.name
      expect(subject.default_amount).to eq category.default_amount
      expect(subject.is_per_diem_enabled).to eq category.per_diem_enabled?
      expect(subject.icon_class_name).to eq category.icon_class_name
      expect(subject.is_accrual).to be category.accrual?
      expect(subject.is_expense).to be category.expense?
      expect(subject.is_monthly).to be category.monthly?
    end
  end

  describe "#archived_at" do
    subject { described_class.new(category) }

    context "when the category is active" do
      let(:category) { FactoryBot.build(:category) }

      it "returns nil" do
        expect(subject.archived_at).to be_nil
      end
    end

    context "when the category is archived" do
      let(:category) { FactoryBot.build(:category, :archived) }

      it "returns nil" do
        expect(subject.render["archivedAt"]).to eq category.archived_at.strftime("%F")
      end
    end
  end

  describe "#maturity_intervals" do
    subject { described_class.new(category) }

    context "when a non-accrual category" do
      let(:category) { FactoryBot.build(:category) }

      it "does not include maturity intervals in the render" do
        expect(subject.render).not_to have_key("maturityIntervals")
      end
    end

    context "when an accrual category" do
      let(:user) { FactoryBot.create(:user) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user.group) }
      let(:category) { FactoryBot.create(:category, :accrual, user_group: user.group) }

      before { FactoryBot.create(:maturity_interval, interval: interval, category: category) }

      it "returns the maturity intervals" do
        expect(subject.maturity_intervals.first.month).to eq interval.month
        expect(subject.maturity_intervals.first.year).to eq interval.year
      end
    end
  end
end
