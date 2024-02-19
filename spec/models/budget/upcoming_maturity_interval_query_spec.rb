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
    create(:maturity_interval, category: category, interval: upcoming_interval)
    create(:maturity_interval, category: category, interval: upcoming_interval.next)
  end

  # rubocop:disable RSpec/ExampleLength
  it "returns the budget category id and a date string" do
    expect(subject).to eq(
      [
        Budget::UpcomingMaturityIntervalQuery::UpcomingMaturityIntervalSerializer.new(
          "budget_category_id" => category.id,
          "upcoming_date" => Date.new(upcoming_interval.year, upcoming_interval.month, 1).strftime("%F"),
        ),
      ]
    )
    expect(subject.find(category.id).render).to eq(
      "budgetCategoryId" => category.id,
      "month" => upcoming_interval.month,
      "year" => upcoming_interval.year,
    )
    expect(subject.find(random_category_id).render).to eq(
      "budgetCategoryId" => random_category_id,
      "month" => nil,
      "year" => nil,
    )
  end
  # rubocop:enable RSpec/ExampleLength
end
