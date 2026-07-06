require "rails_helper"

RSpec.describe Budget::Changes::Rollover::Presenters::EventsReducer do
  subject(:reducer) { described_class.new(change_set) }

  let(:base_interval) { create(:budget_interval) }
  let(:user_group) { base_interval.user_group }
  let(:category) { create(:category, :monthly, :expense, user_group:) }
  let(:base_change_set) do
    Budget::Changes::Setup.create(interval: base_interval)
  end
  let(:change_set) do
    Budget::Changes::Rollover.new(interval: base_interval).assign_categories
  end

  # Two reviewable base items, each rolling forward as its own create event.
  let!(:rolled_item) do
    create(:budget_item, category:, interval: base_interval).tap do |record|
      create(:budget_item_event, :create_event,
        item: record, amount: -100_00, change_set: base_change_set)
    end
  end
  let!(:untouched_item) do
    create(:budget_item, category:, interval: base_interval).tap do |record|
      create(:budget_item_event, :create_event,
        item: record, amount: -40_00, change_set: base_change_set)
    end
  end

  before do
    # Roll one item; leave the other at its default (zero) adjustment.
    change_set.update_data(
      events: { rolled_item.key => { display: "-100.00", cents: -100_00 } }
    )
  end

  it "drops events whose adjustment is zero" do
    expect(reducer.events.size).to eq(1)
  end

  it "formats the adjusted event for the events form" do
    expect(reducer.events.first).to match(
      event_type: "rollover_item_create",
      amount: -100_00,
      month: base_interval.month,
      year: base_interval.year,
      data: {},
      budget_item_key: a_string_matching(/\A\w{12}\z/),
      budget_category_key: category.key
    )
  end

  it "assigns a fresh budget item key for create events" do
    keys = [ rolled_item.key, untouched_item.key ]

    expect(keys).not_to include(reducer.events.first[:budget_item_key])
  end
end
