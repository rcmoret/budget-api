require "rails_helper"

RSpec.describe Budget::Changes::Setup::Presenters::EventsReducer do
  subject(:reducer) { described_class.new(change_set) }

  let(:change_set) { described_class.create(events_data: events_data, interval: create(:budget_interval)) }
  let(:budget_item_key) { KeyGenerator.call }
  let(:second_item_key) { KeyGenerator.call }
  let(:expense_category) { create(:category, :expense) }
  let(:revenue_category) { create(:category, :revenue) }
  let(:category_pairs) do
    [
      CategoryPair.new(
        expense_category,
        [
          {
            amount: -100_00,
            key: budget_item_key,
          },
        ],
      ),
      CategoryPair.new(
        revenue_category,
        [
          {
            amount: -100_00,
            key: second_item_key,
          },
        ]
      ),
    ]
  end

  let(:events_data) do
    fixture_response(
      "budget",
      "setup",
      "categories",
      categories: category_pairs,
    )
  end
end
