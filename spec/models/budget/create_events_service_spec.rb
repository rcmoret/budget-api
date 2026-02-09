require "rails_helper"

RSpec.describe Budget::CreateEventsService do
  describe ".call" do
    subject(:events) do
      described_class.call(interval:, event_context:,
        scopes:)
    end

    let(:interval) { create(:budget_interval) }
    let(:event_context) { :current }
    let(:scopes) { [] }
    let(:user_profile) do
      interval.user_group.users.first || create(:user,
        user_group: interval.user_group)
    end

    let!(:monthly_category) do
      create(:category, :monthly, :expense, user_group: interval.user_group)
    end
    let!(:weekly_category) do
      create(:category, :weekly, :expense, user_group: interval.user_group)
    end

    it "returns an array of event hashes" do
      expect(events).to be_an(Array)
      expect(events.length).to eq(2)
    end

    it "sets the correct attributes" do
      expect(events.first[:amount]).to eq(0)
      expect(events.first[:budget_category_key]).to eq(monthly_category.key)
      expect(events.first[:budget_item_key]).to be_a(String)
      expect(events.first[:budget_item_key].length).to eq(12)
      expect(events.first[:key]).to be_a(String)
      expect(events.first[:key].length).to eq(12) # hex(6) = 12 chars
      expect(events.first[:data]).to eq({})
    end

    describe "exclusion of weekly categories with existing items" do
      let!(:weekly_category_with_item) do
        create(:category, :weekly, :expense,
          user_group: interval.user_group).tap do |category|
          create(:budget_item, category:, interval:)
        end
      end

      let!(:weekly_category_without_item) do
        create(:category, :weekly, :expense, user_group: interval.user_group)
      end

      let!(:monthly_category) do
        create(:category, :monthly, :expense, user_group: interval.user_group)
      end

      it "excludes weekly categories that have items in the interval" do
        category_keys = events.pluck(:budget_category_key)

        expect(category_keys).not_to include(weekly_category_with_item.key)
        expect(category_keys).to include(weekly_category_without_item.key)
        expect(category_keys).to include(monthly_category.key)
      end
    end

    describe "category scopes" do
      let!(:expense_category) do
        create(:category, :expense, user_group: interval.user_group)
      end
      let!(:revenue_category) do
        create(:category, :revenue, user_group: interval.user_group)
      end
      let!(:monthly_category) do
        create(:category, :monthly, user_group: interval.user_group)
      end
      let!(:weekly_category) do
        create(:category, :weekly, user_group: interval.user_group)
      end
      let!(:accrual_category) do
        create(:category, :expense, :accrual, user_group: interval.user_group)
      end
      let!(:non_accrual_category) do
        create(:category, :expense, user_group: interval.user_group)
      end

      context "when scopes is empty" do
        let(:scopes) { [] }

        it "returns all non-excluded categories" do
          expect(events.length).to be >= 6
        end
      end

      context "when scopes includes :expense" do
        let(:scopes) { [ :expenses ] }

        it "returns only expense categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(expense_category.key)
          expect(category_keys).not_to include(revenue_category.key)
        end
      end

      context "when scopes includes :revenues" do
        let(:scopes) { [ :revenues ] }

        it "returns only revenue categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(revenue_category.key)
          expect(category_keys).not_to include(expense_category.key)
        end
      end

      context "when scopes includes :monthly" do
        let(:scopes) { [ :monthly ] }

        it "returns only monthly categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(monthly_category.key)
          expect(category_keys).not_to include(weekly_category.key)
        end
      end

      context "when scopes includes :weekly" do
        let(:scopes) { [ :weekly ] }

        it "returns only weekly categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(weekly_category.key)
          expect(category_keys).not_to include(monthly_category.key)
        end
      end

      context "when scopes includes :accruals" do
        let(:scopes) { [ :accruals ] }

        it "returns only accrual categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(accrual_category.key)
          expect(category_keys).not_to include(non_accrual_category.key)
        end
      end

      context "when scopes includes :non_accruals" do
        let(:scopes) { [ :non_accruals ] }

        it "returns only non-accrual categories" do
          category_keys = events.pluck(:budget_category_key)

          expect(category_keys).to include(non_accrual_category.key)
          expect(category_keys).not_to include(accrual_category.key)
        end
      end

      context "when scopes includes multiple scopes" do
        let(:scopes) { %i[expenses monthly] }

        it "applies all scopes" do
          category_keys = events.pluck(:budget_category_key)

          if monthly_category.expense?
            expect(category_keys).to include(monthly_category.key)
          end
          expect(category_keys).not_to include(weekly_category.key)
          expect(category_keys).not_to include(revenue_category.key)
        end
      end

      context "when scopes includes an invalid scope" do
        let(:scopes) { [ :invalid_scope ] }

        it "ignores the invalid scope" do
          expect(events.length).to be >= 6
        end
      end
    end

    describe "event_types based on event_context" do
      before { create(:category, user_group: interval.user_group) }

      context "when event_context is :current (default)" do
        let(:event_context) { :current }

        it "returns [ITEM_CREATE, MULTI_ITEM_ADJUST_CREATE]" do
          expect(events.first[:event_types]).to eq(
            [
              Budget::EventTypes::ITEM_CREATE,
              Budget::EventTypes::MULTI_ITEM_ADJUST_CREATE,
            ]
          )
        end
      end

      context "when event_context is :pre_setup" do
        let(:event_context) { :pre_setup }

        it "returns [PRE_SETUP_ITEM_CREATE, " \
           "PRE_SETUP_MULTI_ITEM_ADJUST_CREATE]" do
          expect(events.first[:event_types]).to eq(
            [
              Budget::EventTypes::PRE_SETUP_ITEM_CREATE,
              Budget::EventTypes::PRE_SETUP_MULTI_ITEM_ADJUST_CREATE,
            ]
          )
        end
      end

      context "when event_context is :setup" do
        let(:event_context) { :setup }

        it "returns [SETUP_ITEM_CREATE]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::SETUP_ITEM_CREATE ])
        end
      end

      context "when event_context is :close_out" do
        let(:event_context) { :close_out }

        it "returns [ROLLOVER_ITEM_CREATE, ROLLOVER_ITEM_CREATE]" do
          expect(events.first[:event_types]).to eq(
            [
              Budget::EventTypes::ROLLOVER_ITEM_CREATE,
              Budget::EventTypes::ROLLOVER_ITEM_CREATE,
            ]
          )
        end
      end

      context "when event_context is a CREATE_EVENT constant" do
        let(:event_context) { Budget::EventTypes::ITEM_CREATE }

        it "returns [event_context]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::ITEM_CREATE ])
        end
      end

      context "when event_context is PRE_SETUP_ITEM_CREATE" do
        let(:event_context) { Budget::EventTypes::PRE_SETUP_ITEM_CREATE }

        it "returns [PRE_SETUP_ITEM_CREATE]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::PRE_SETUP_ITEM_CREATE ])
        end
      end

      context "when event_context is MULTI_ITEM_ADJUST_CREATE" do
        let(:event_context) { Budget::EventTypes::MULTI_ITEM_ADJUST_CREATE }

        it "returns [MULTI_ITEM_ADJUST_CREATE]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::MULTI_ITEM_ADJUST_CREATE ])
        end
      end

      context "when event_context is SETUP_ITEM_CREATE" do
        let(:event_context) { Budget::EventTypes::SETUP_ITEM_CREATE }

        it "returns [SETUP_ITEM_CREATE]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::SETUP_ITEM_CREATE ])
        end
      end

      context "when event_context is ROLLOVER_ITEM_CREATE" do
        let(:event_context) { Budget::EventTypes::ROLLOVER_ITEM_CREATE }

        it "returns [ROLLOVER_ITEM_CREATE]" do
          expect(events.first[:event_types])
            .to eq([ Budget::EventTypes::ROLLOVER_ITEM_CREATE ])
        end
      end
    end

    describe "with different user groups" do
      let(:other_user_group) { create(:user_group) }
      let!(:category_in_interval_group) do
        create(:category, user_group: interval.user_group)
      end
      let!(:category_in_other_group) do
        create(:category, user_group: other_user_group)
      end

      it "only returns categories from the interval's user group" do
        category_keys = events.pluck(:budget_category_key)

        expect(category_keys).to include(category_in_interval_group.key)
        expect(category_keys).not_to include(category_in_other_group.key)
      end
    end

    describe "caching of category_scope" do
      before do
        create(:category, user_group: interval.user_group)
        create(:category, user_group: interval.user_group)
      end

      # let!(:category1) { create(:category, user_group: interval.user_group) }
      # let!(:category2) { create(:category, user_group: interval.user_group) }

      it "memoizes the category scope" do
        service = described_class.new(interval:,
          event_context: :current, scopes: [])
        first_call = service.call
        second_call = service.call

        expect(first_call.pluck(:budget_category_key)).to eq(
          second_call.pluck(:budget_category_key)
        )
      end
    end
  end

  describe "#initialize" do
    let(:interval) { create(:budget_interval) }

    it "accepts interval, event_context, and scopes" do
      service = described_class.new(
        interval:,
        event_context: :setup,
        scopes: %i[expense monthly]
      )

      expect(service.interval).to eq(interval)
    end
  end

  describe "#user_group" do
    let(:interval) { create(:budget_interval) }
    let(:service) { described_class.new(interval:) }

    it "delegates to interval" do
      expect(service.user_group).to eq(interval.user_group)
    end
  end
end
