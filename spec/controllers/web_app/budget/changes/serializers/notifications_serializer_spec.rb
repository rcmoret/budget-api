require "rails_helper"

RSpec.describe WebApp::Budget::Changes::Serializers::NotificationsSerializer do
  let(:user_group) { create(:user_group) }
  let(:budget_month) do
    create(:budget_interval, user_group:)
  end
  let(:change_set) do
    create(
      :budget_change_set,
      :adjust,
      interval: budget_month
    )
  end
  let(:fun_funds) do
    create_budget_item(
      :weekly,
      :expense,
      budget_month:,
      name: "Good Times",
      change_set:,
      amount: -419_00
    )
  end
  let(:car_payment) do
    create_budget_item(
      :monthly,
      :expense,
      budget_month:,
      name: "Car Note",
      change_set:,
      amount: -220_22
    )
  end
  let(:bonus) do
    create_budget_item(
      :monthly,
      :revenue,
      budget_month:,
      name: "Bonus",
      change_set:,
      amount: -443_99
    )
  end

  before do
    bonus
    fun_funds
    car_payment
  end

  describe "to_h" do
    subject(:serialized) do
      described_class.new(events: change_set.events).to_h
    end

    it "creates returns an array of messages" do
      expect(serialized["notifications"].compact_blank).to contain_exactly(
        "#{fun_funds.name} item added",
        "#{bonus.name} item added",
        "#{car_payment.name} item added",
      )
    end

    context "with adjust events" do
      let(:groceries) do
        create_budget_item(
          :monthly,
          :expense,
          budget_month:,
          name: "Groceries",
          change_set:,
          amount: -150_00,
          event_trait: :item_adjust
        )
      end

      before { groceries }

      it "includes an adjusted message" do
        expect(serialized["notifications"].compact_blank).to include(
          "#{groceries.name} item adjusted"
        )
      end
    end

    context "when an adjust event has a zero amount" do
      let(:no_op_adjust) do
        create_budget_item(
          :monthly,
          :expense,
          budget_month:,
          name: "No Op",
          change_set:,
          amount: 0,
          event_trait: :item_adjust
        )
      end

      before { no_op_adjust }

      it "skips the adjusted notification" do
        expect(serialized["notifications"].compact_blank).not_to include(
          a_string_matching(/#{no_op_adjust.name}/)
        )
      end
    end

    context "when a create event has a zero amount" do
      let(:zero_create) do
        create_budget_item(
          :monthly,
          :expense,
          budget_month:,
          name: "Fresh Start",
          change_set:,
          amount: 0
        )
      end

      before { zero_create }

      it "still notifies on the created item" do
        expect(serialized["notifications"].compact_blank).to include(
          "#{zero_create.name} item added"
        )
      end
    end

    context "with a delete event" do
      let(:cancelled) do
        create_budget_item(
          :monthly,
          :expense,
          budget_month:,
          name: "Cancelled Sub",
          change_set:,
          amount: -9_99,
          event_trait: :item_delete
        )
      end

      before { cancelled }

      it "includes a deleted message" do
        expect(serialized["notifications"].compact_blank).to include(
          "#{cancelled.name} item deleted"
        )
      end
    end
  end

  def create_budget_item(
    *category_traits,
    budget_month:,
    name:,
    amount:,
    change_set:,
    event_trait: :item_create
  )
    user_group = budget_month.user_group
    category = create(:category, *category_traits, name:, user_group:)
    create(:budget_item, category:, interval: budget_month).tap do |item|
      create(:budget_item_event, event_trait, item:, amount:, change_set:)
    end
  end
end
