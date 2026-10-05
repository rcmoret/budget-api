require "rails_helper"

RSpec.describe "WebApp::Budget::Rollover::FinalizeController", :inertia do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:interval) { create(:budget_interval, month: 6, year: 2026, user_group:) }
  let(:setup_change_set) { Budget::Changes::Setup.create(interval:) }
  let(:path) { "/budget/#{interval.month}/#{interval.year}/roll-over" }
  let(:groceries) do
    create(:category, :weekly, :expense, name: "Groceries", user_group:)
  end
  let!(:review_item) do
    create(:budget_item, category: groceries, interval:).tap do |item|
      create(:budget_item_event, :item_create,
        item:, user:, amount: -100_00, change_set: setup_change_set)
    end
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before do
    sign_in(user)
    get path
  end

  def change_set = Budget::Changes::Rollover.find_by!(interval:)

  def review_all
    put "#{path}/#{groceries.slug}",
      params: { item: { key: review_item.key, adjustment: { cents: -100_00 } } }
  end

  it "rolls over and redirects to the upcoming month's dashboard" do
    review_all

    expect { post path }
      .to change { Budget::ItemEvent.where(change_set:).count }.by(1)
    expect(response).to redirect_to("/budget/7/2026")
    expect(interval.reload).to be_closed_out
  end

  it "redirects back with a warning when it can't roll over" do
    post path

    expect(response).to redirect_to(path)
    expect(flash[:warning]).to match(/review every category/)
    expect(interval.reload).not_to be_closed_out
  end

  it "can't roll over twice" do
    review_all
    post path

    expect { post path }.not_to(change { Budget::ItemEvent.count })
    expect(flash[:warning]).to match(/already been rolled over/)
  end
end
