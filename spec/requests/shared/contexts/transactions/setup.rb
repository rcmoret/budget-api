require "rails_helper"

RSpec.shared_context "when the user posts transaction with a single detail" do
  include_context "when there is a current interval and item"

  let(:params) do
    {
      "transaction" => {
        "description" => "Publix",
        "clearance_date" => nil,
        "key" => KeyGenerator.call,
        "is_budget_exclusion" => budget_exclusion,
        "details_attributes" => [
          {
            "key" => KeyGenerator.call,
            "budget_item_key" => budget_item&.key,
            "amount" => amount,
          },
        ],
      },
    }
  end
end

RSpec.shared_context "when the user posts transaction with a single detail and a clearance date" do
  include_context "when there is a current interval and item"

  let(:params) do
    {
      "transaction" => {
        "description" => "Publix",
        "clearance_date" => clearance_date,
        "key" => KeyGenerator.call,
        "is_budget_exclusion" => budget_exclusion,
        "details_attributes" => [
          {
            "key" => KeyGenerator.call,
            "budget_item_key" => budget_item&.key,
            "amount" => amount,
          },
        ],
      },
    }
  end
end

RSpec.shared_context "when user posts transaction with multiple details" do
  include_context "when the user has an account"
  include_context "when there is a current interval and item"
  let(:first_amount) { rand(100_00) }
  let(:second_amount) { -1 * rand(100_00) }

  let(:params) do
    {
      "transaction" => {
        "description" => "Publix",
        "clearance_date" => nil,
        "key" => KeyGenerator.call,
        "details_attributes" => [
          {
            "key" => KeyGenerator.call,
            "budget_item_key" => budget_item.key,
            "amount" => first_amount,
          },
          {
            "key" => KeyGenerator.call,
            "amount" => second_amount,
          },
        ],
      },
    }
  end
end

RSpec.shared_context "when user posts transaction with no details" do
  include_context "when the user has an account"
  include_context "when there is a current interval and item"

  let(:params) do
    {
      "transaction" => {
        "description" => "Publix",
        "clearance_date" => nil,
        "key" => KeyGenerator.call,
        "details_attributes" => {},
      },
    }
  end
end

RSpec.shared_context "when the user has an account" do
  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }
end

RSpec.shared_context "when the user has a non-cash-flow account" do
  let(:user) { create(:user) }
  let(:account) { create(:savings_account, user_group: user.group) }
end

RSpec.shared_context "when there is a current interval and item" do
  let(:month) { interval.month }
  let(:year) { interval.year }
  let(:interval) { create(:budget_interval, :current, user_group: user.group) }
  let(:icon) { create(:icon) }
  let(:budget_category) { create(:category, :monthly, user_group: user.group, icon: icon) }
  let(:budget_item) do
    create(:budget_item, interval: interval, category: budget_category)
  end

  before do
    interval.prev.update(close_out_completed_at: 1.day.ago)
  end
end
