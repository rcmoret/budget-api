require "rails_helper"

RSpec.describe "GET /api/budget/intervals/finalize/(:month)/(:year)" do
  subject do
    get(api_budget_interval_finalize_path(*url_args), headers: headers)
  end

  context "when specifiying month and year in the url" do
    include_context "with valid token"

    let(:url_args) { [interval.month, interval.year] }
    let(:interval) { create(:budget_interval, :current, user_group: user.group) }

    before { interval }

    context "when there are no reviewable items" do
      before { subject }

      it "returns an :ok status and data" do
        expect(response).to have_http_status :ok
        body = response.parsed_body.deep_symbolize_keys
        expect(body).to eq(
          data: {
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
            budgetCategories: [],
          }
        )
      end
    end

    context "when a budget category has a base items, no target items" do
      context "when the category is monthly" do
        let(:category) { create(:category, :monthly, :expense, user_group: user.group) }
        let(:amount) { rand(-100_00..-100) }
        let!(:budget_item) do
          create(:budget_item, category: category, interval: interval.prev).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
        end

        before { subject }

        it "returns an :ok status and data - including a create event" do
          expect(response).to have_http_status :ok
          body = response.parsed_body.deep_symbolize_keys
          expect(body[:data]).to include(
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
          )
          expect(body.dig(:data, :budgetCategories, 0, :events).size).to be 1
          expect(body.dig(:data, :budgetCategories, 0)).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?
          )
          expect(body.dig(:data, :budgetCategories, 0, :events, 0)).to include(
            month: interval.month,
            year: interval.year,
            amount: "",
            budgeted: amount,
            spent: 0,
            eventType: "rollover_item_create",
            data: { referencedFrom: "budget item: #{budget_item.key}" }
          )
        end
      end

      context "when the category is weekly" do
        let(:category) { create(:category, :weekly, user_group: user.group) }
        let(:amount) { rand(-100_00..-100) }
        let!(:budget_item) do
          create(:budget_item, category: category, interval: interval.prev).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
        end

        before { subject }

        it "returns an :ok status and data - including a create event" do
          expect(response).to have_http_status :ok
          body = response.parsed_body.deep_symbolize_keys
          expect(body[:data]).to include(
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
          )
          expect(body.dig(:data, :budgetCategories, 0, :events).size).to be 1
          expect(body.dig(:data, :budgetCategories, 0)).to include(
            key: category.key,
            name: category.name,
            slug: category.slug,
            iconClassName: category.icon_class_name,
            isAccrual: category.accrual?,
            isExpense: category.expense?,
            isMonthly: category.monthly?
          )
          expect(body.dig(:data, :budgetCategories, 0, :events, 0)).to include(
            month: interval.month,
            year: interval.year,
            amount: "",
            budgeted: amount,
            spent: 0,
            eventType: "rollover_item_create",
            data: { referencedFrom: "budget item: #{budget_item.key}" }
          )
        end
      end
    end

    context "when a budget category has a base items, and a target items" do
      context "when the category is monthly" do
        let(:category) { create(:category, :expense, :monthly, user_group: user.group) }
        let(:amount) { rand(-100_00..-100) }
        let!(:previous_budget_item) do
          create(:budget_item, category: category, interval: interval.prev).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
        end
        let!(:upcoming_budget_item) do
          create(:budget_item, category: category, interval: interval).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
        end

        before { subject }

        it "returns an :ok status and data - including a create event and an adjust event" do
          expect(response).to have_http_status :ok
          body = response.parsed_body.deep_symbolize_keys
          expect(body[:data]).to include(
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
          )
          expect(body.dig(:data, :budgetCategories, 0, :events).size).to be 2
          expect(body.dig(:data, :budgetCategories, 0, :events, 0)).to include(
            amount: amount,
            budgetItemKey: upcoming_budget_item.key,
            data: {},
            eventType: "rollover_item_adjust",
            spent: 0,
            budgeted: amount
          )
          expect(body.dig(:data, :budgetCategories, 0, :events, 1)).to include(
            month: interval.month,
            year: interval.year,
            amount: "",
            budgeted: amount,
            spent: 0,
            eventType: "rollover_item_create",
            data: { referencedFrom: "budget item: #{previous_budget_item.key}" }
          )
        end
      end

      context "when the category is a monthly accrual" do
        let(:category) { create(:category, :accrual, :expense, :monthly, user_group: user.group) }
        let(:amount) { rand(-100_00..-100) }

        before do
          create(:budget_item, category: category, interval: interval.prev).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
          create(:budget_item, category: category, interval: interval).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
          subject
        end

        it "returns an :ok status and data - including an adjust event" do
          body = response.parsed_body.deep_symbolize_keys
          expect(body.dig(:data, :budgetCategories, 0, :events).size).to be 1
          expect(body.dig(:data, :budgetCategories, 0, :events, 0)).to include(
            amount: amount,
            data: {},
            eventType: "rollover_item_adjust",
            spent: 0,
            budgeted: amount
          )
        end
      end

      context "when the category is weekly" do
        let(:category) { create(:category, :expense, :weekly, user_group: user.group) }
        let(:amount) { rand(-100_00..-100) }
        let!(:upcoming_budget_item) do
          create(:budget_item, category: category, interval: interval).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
        end

        before do
          create(:budget_item, category: category, interval: interval.prev).tap do |item|
            create(:budget_item_event, :create_event, item: item, amount: amount)
          end
          subject
        end

        it "returns an :ok status and data - including an adjust event" do
          expect(response).to have_http_status :ok
          body = response.parsed_body.deep_symbolize_keys
          expect(body[:data]).to include(
            firstDate: interval.first_date.strftime("%F"),
            lastDate: interval.last_date.strftime("%F"),
          )
          expect(body.dig(:data, :budgetCategories, 0, :events).size).to be 1
          expect(body.dig(:data, :budgetCategories, 0, :events, 0)).to include(
            budgetItemKey: upcoming_budget_item.key,
            amount: amount,
            data: {},
            eventType: "rollover_item_adjust",
            spent: 0,
            budgeted: amount
          )
        end
      end
    end
  end

  context "when not passing month / year url params" do
    include_context "with valid token"

    let(:interval) { build(:budget_interval, :current, user_group: user.group) }
    let(:url_args) { [] }

    it "returns an :ok status and data" do
      subject
      expect(response).to have_http_status :ok
      body = response.parsed_body.deep_symbolize_keys
      expect(body).to eq(
        data: {
          firstDate: interval.first_date.strftime("%F"),
          lastDate: interval.last_date.strftime("%F"),
          budgetCategories: [],
        }
      )
    end
  end

  context "when passing invalid month / year combination" do
    include_context "with valid token"

    let(:url_args) { [month, year] }

    it_behaves_like "endpoint requires budget interval"
  end

  context "when passing an invalid token" do
    let(:url_args) { [] }

    it_behaves_like "a token authenticated endpoint"
  end
end
