require "rails_helper"

RSpec.shared_context "when the user posts transaction with a single detail" do
  include_context "when there is a current interval and item"

  let(:params) do
    {
      "transaction" => {
        "description" => "Publix",
        "clearanceDate" => nil,
        "key" => SecureRandom.hex(6),
        "budgetExclusion" => budget_exclusion,
        "detailsAttributes" => {
          "0" => {
            "key" => SecureRandom.hex(6),
            "budgetItemKey" => budget_item&.key,
            "amount" => amount,
          },
        },
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
        "clearanceDate" => clearance_date,
        "key" => SecureRandom.hex(6),
        "budgetExclusion" => budget_exclusion,
        "detailsAttributes" => {
          "0" => {
            "key" => SecureRandom.hex(6),
            "budgetItemKey" => budget_item&.key,
            "amount" => amount,
          },
        },
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
        "clearanceDate" => nil,
        "key" => SecureRandom.hex(6),
        "detailsAttributes" => {
          "0" => {
            "key" => SecureRandom.hex(6),
            "budgetItemKey" => budget_item.key,
            "amount" => first_amount,
          },
          "1" => {
            "key" => SecureRandom.hex(6),
            "amount" => second_amount,
          },
        },
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
        "clearanceDate" => nil,
        "key" => SecureRandom.hex(6),
        "detailsAttributes" => {},
      },
    }
  end
end

RSpec.shared_context "when the user has an account" do
  let(:user) { FactoryBot.create(:user) }
  let(:account) { FactoryBot.create(:account, user_group: user.group) }
end

RSpec.shared_context "when the user has a non-cash-flow account" do
  let(:user) { FactoryBot.create(:user) }
  let(:account) { FactoryBot.create(:savings_account, user_group: user.group) }
end

RSpec.shared_context "when there is a current interval and item" do
  let(:month) { interval.month }
  let(:year) { interval.year }
  let(:interval) { FactoryBot.create(:budget_interval, :current, user_group: user.group) }
  let(:icon) { FactoryBot.create(:icon) }
  let(:budget_category) { FactoryBot.create(:category, :monthly, user_group: user.group, icon: icon) }
  let(:budget_item) do
    FactoryBot.create(:budget_item, interval: interval, category: budget_category, user_group: user.group)
  end

  before do
    interval.prev.update(close_out_completed_at: 1.day.ago)
  end
end
