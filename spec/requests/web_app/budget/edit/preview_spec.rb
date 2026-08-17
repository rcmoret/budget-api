require "rails_helper"

RSpec.describe "WebApp::Budget::Edit::PreviewController", :inertia do
  subject(:post_preview) { post path, params: { changes: }, as: :json }

  let(:path) { "/budget/#{interval.month}/#{interval.year}/edit/preview" }
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, :current, :set_up, user_group:) }
  let(:change_set) { create(:budget_change_set, :adjust, interval:) }

  let(:before_discretionary) do
    get "/budget/#{interval.month}/#{interval.year}"
    inertia.props[:discretionary]
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  # Same pattern dashboard_spec.rb uses: give the item a single item_create
  # event so it surfaces as an active detailed_item with this amount.
  def build_item(factory:, amount:)
    create(factory, interval:).tap do |item|
      item.category.update!(user_group:)
      create(:budget_item_event, :item_create,
        item:, user:, amount:, change_set:)
    end
  end

  describe "adjusting an item with no transactions yet" do
    let!(:item) { build_item(factory: :monthly_expense, amount: -100_00) }
    let(:new_amount) { -150_00 }
    let(:changes) do
      [
        {
          budgetItemKey: item.key,
          budgetCategoryKey: item.category.key,
          amount: new_amount,
          eventType: "item_adjust",
        },
      ]
    end

    it "moves remaining by exactly the change in amount" do
      before_remaining = before_discretionary[:remaining][:cents]

      post_preview

      after_remaining = response.parsed_body["remaining"]["cents"]
      expect(after_remaining - before_remaining).to eq(new_amount - -100_00)
    end

    it "leaves over/under budget unchanged" do
      before_over_under = before_discretionary[:overUnderBudget][:cents]

      post_preview

      after_over_under = response.parsed_body["overUnderBudget"]["cents"]
      expect(after_over_under).to eq(before_over_under)
    end
  end

  describe "adjusting an item that already has a transaction" do
    let!(:item) { build_item(factory: :monthly_expense, amount: -100_00) }
    let(:new_amount) { -130_00 }
    let(:changes) do
      [
        {
          budgetItemKey: item.key,
          budgetCategoryKey: item.category.key,
          amount: new_amount,
          eventType: "item_adjust",
        },
      ]
    end

    before do
      account = create(:account, :cash_flow, user_group:)
      create(:transaction_entry, account:, details_attributes: [
        { key: KeyGenerator.call, amount: -40_00, budget_item_id: item.id },
      ])
    end

    it "does not move remaining (already reflected in real spend, not budget)" do
      before_remaining = before_discretionary[:remaining][:cents]

      post_preview

      after_remaining = response.parsed_body["remaining"]["cents"]
      expect(after_remaining).to eq(before_remaining)
    end

    it "shifts over/under budget by the inverse of the amount change" do
      before_over_under = before_discretionary[:overUnderBudget][:cents]
      delta = new_amount - -100_00

      post_preview

      after_over_under = response.parsed_body["overUnderBudget"]["cents"]
      expect(after_over_under).to eq(before_over_under - delta)
    end
  end

  describe "creating a brand-new item" do
    let(:category) { create(:category, :monthly, :expense, user_group:) }
    let(:new_amount) { -25_00 }
    let(:changes) do
      [
        {
          budgetItemKey: KeyGenerator.call,
          budgetCategoryKey: category.key,
          amount: new_amount,
          eventType: "item_create",
        },
      ]
    end

    it "adds the new item's full amount to remaining" do
      before_remaining = before_discretionary[:remaining][:cents]

      post_preview

      after_remaining = response.parsed_body["remaining"]["cents"]
      expect(after_remaining - before_remaining).to eq(new_amount)
    end
  end

  it "does not persist anything" do
    item = build_item(factory: :monthly_expense, amount: -100_00)
    changes = [
      {
        budgetItemKey: item.key,
        budgetCategoryKey: item.category.key,
        amount: -999_00,
        eventType: "item_adjust",
      },
    ]

    expect { post path, params: { changes: }, as: :json }
      .not_to change { item.reload.amount }
  end
end
