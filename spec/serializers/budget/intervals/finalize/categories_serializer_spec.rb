require "rails_helper"

RSpec.describe Budget::Intervals::Finalize::CategoriesSerializer do
  describe "#first_date" do
    subject { described_class.new(interval).first_date }

    let(:interval) { FactoryBot.build(:budget_interval) }

    specify do
      expect(subject).to eq interval.first_date.strftime("%F")
    end
  end

  describe "#last_date" do
    subject { described_class.new(interval).last_date }

    let(:interval) { FactoryBot.build(:budget_interval) }

    specify do
      expect(subject).to eq interval.last_date.strftime("%F")
    end
  end

  describe "#budget_categories" do
    subject { described_class.new(interval) }

    context "when a budget category has no items" do
      let(:user_group) { FactoryBot.create(:user_group) }
      let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }

      before { FactoryBot.create(:category, user_group: user_group) }

      it "responds with an emtpy object" do
        expect(subject.budget_categories).to eq []
      end
    end
  end
end
