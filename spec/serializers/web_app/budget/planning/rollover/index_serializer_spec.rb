require "rails_helper"

RSpec.describe WebApp::Budget::Planning::Rollover::IndexSerializer do
  subject(:result) do
    described_class.new(
      presenter,
      params: { month: base_interval.month, year: base_interval.year }
    ).to_h
  end

  let(:base_interval) { create(:budget_interval) }
  let(:user_group) { base_interval.user_group }
  let(:category) { create(:category, :monthly, :expense, user_group:) }
  let(:change_set) do
    Budget::Changes::Rollover.new(interval: base_interval).assign_categories
  end
  let(:data_model) do
    change_set.reload.data_model.with(slug: change_set.data_model.slugs.first)
  end
  let(:metadata) do
    Presenters::ControllerMetadata.new(
      namespace: "budget",
      page_name: "budget_planning_rollover",
      prev_selected_account_path: ""
    )
  end
  let(:presenter) do
    Budget::Changes::Rollover::Presenters::IndexPresenter.new(
      data_model, base_interval, metadata
    )
  end

  # A reviewable base item so the category rolls over and appears in the data.
  before do
    item = create(:budget_item, category:, interval: base_interval)
    create(:budget_item_event, :create_event,
      item:, amount: -100_00,
      change_set: Budget::Changes::Setup.create(interval: base_interval))
  end

  it "serializes the rollover form props the page expects" do
    expect(result.keys).to include(
      "featuredCategory", "budgetMonth", "neighborLinks", "groups", "metadata"
    )
  end

  it "exposes the rollover-specific flags on the featured category events" do
    flags = result.dig("featuredCategory", "events", 0, "flags")

    expect(flags.keys).to contain_exactly(
      "rolloverAll",
      "rolloverNone",
      "showDefaultSuggestion",
      "unreviewed",
      "isValid"
    )
  end

  it "links grouped categories to the rollover form route" do
    route = result.dig("groups", "fixedExpenses", "categories", 0, "route")

    expect(route).to eq(
      "/budget/#{base_interval.month}/#{base_interval.year}" \
      "/roll-over/#{category.slug}"
    )
  end
end
