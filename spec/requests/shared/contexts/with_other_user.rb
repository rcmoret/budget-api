require "rails_helper"

RSpec.shared_context "with another user group" do
  let(:other_user) { FactoryBot.create(:user) }
  let(:other_user_group) { other_user.group }

  before { other_user }
end

RSpec.shared_context "with an account belonging to a different user group" do
  include_context "with another user group"

  let(:other_groups_account) do
    FactoryBot.create(:account, user_group: other_user_group)
  end

  before { other_groups_account }
end

RSpec.shared_context "with a budget category belonging to a different user group" do
  include_context "with another user group"

  let(:other_groups_budget_interval) do
    FactoryBot.create(
      :budget_interval,
      user_group: other_user_group,
      month: interval.month,
      year: interval.year,
    )
  end
  let(:other_groups_budget_category) do
    FactoryBot.create(:category, user_group: other_user_group)
  end
  let(:other_groups_budget_item) do
    FactoryBot.create(
      :budget_item,
      category: other_groups_budget_category,
      interval: other_groups_budget_interval,
    )
  end

  before do
    other_groups_budget_item
  end
end

RSpec.shared_context "with transactions belonging to another user group" do
  include_context "with an account belonging to a different user group"

  let(:other_groups_budget_interval) do
    FactoryBot.create(
      :budget_interval,
      user_group: other_user_group,
      month: interval.month,
      year: interval.year,
    )
  end
  let(:other_groups_transaction) do
    FactoryBot.create(
      :transaction_entry,
      account: other_groups_account,
      clearance_date: other_groups_budget_interval.date_range.to_a.sample
    )
  end

  before { other_groups_transaction }
end
