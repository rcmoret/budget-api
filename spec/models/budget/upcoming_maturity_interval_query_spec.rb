require "rails_helper"

RSpec.describe Budget::UpcomingMaturityIntervalQuery do
  subject { described_class.new(interval: current_interval).call }

  let(:user) { create(:user) }
  let(:current_interval) { create(:budget_interval, user_group: user.group) }
  let(:upcoming_interval) { current_interval.next.next }
  let(:category) { create(:category, :accrual, user_group: user.group) }
  let(:random_category_id) { rand(1..1000) }

  before do
    create(:category, :accrual, user_group: user.group)
    create(:maturity_interval, category:, interval: upcoming_interval)
    create(:maturity_interval, category:,
      interval: upcoming_interval.next)
  end

  it "returns the budget category id, month, year for an upcoming maturity" do
    expect(subject.find(category.id).serializable_hash).to eq(
      "budgetCategoryId" => category.id,
      "month" => upcoming_interval.month,
      "year" => upcoming_interval.year,
    )
  end

  it "returns nil month and year when the category has no upcoming maturity" do
    expect(subject.find(random_category_id).serializable_hash).to eq(
      "budgetCategoryId" => random_category_id,
      "month" => nil,
      "year" => nil,
    )
  end
end
