# frozen_string_literal: true

module Budget
  class CreateEventsService
    include EventTypes

    EventSerializer = Class.new do
      include Alba::Resource
      attributes :name,
        :slug

      attribute(:budget_category_key, &:key)
      attribute(:amount) { 0 }
      attribute(:data) { {} }
      attribute(:budget_item_key) { KeyGenerator.call }
      attribute(:key) { KeyGenerator.call }
      attribute(:event_type) { params[:event_type] }

      transform_keys :lower_camel
    end

    def self.call(...)
      new(...).call
    end

    def initialize(
      interval:,
      event_context: "current",
      scopes: [],
      excluded_keys: []
    )
      @interval = interval
      @event_context =
        ActiveSupport::StringInquirer.new(event_context.to_s)
      @excluded_keys = excluded_keys
      @scopes = scopes
    end

    def call
      category_scope.order(name: :asc).map do |category|
        EventSerializer.new(category, params: { event_type: }).to_h
      end
    end

    delegate :user_group, to: :interval

    attr_reader :interval, :excluded_keys

    private

    def excluded_category_ids
      scope = user_group.budget_categories

      scope
        .where(id: interval.items.weekly.pluck(:budget_category_id))
        .or(scope.where(key: excluded_keys))
        .pluck(:id)
    end

    CATEGORY_SCOPES = %i[
      accruals
      expenses
      monthly
      non_accruals
      revenues
      weekly
    ].freeze

    def initial_scope
      user_group
        .budget_categories
        .where
        .not(id: excluded_category_ids)
    end

    def category_scope
      @category_scope ||=
        @scopes.reduce(initial_scope) do |categories, named_scope|
          case named_scope.to_sym
          when *CATEGORY_SCOPES
            categories.public_send(named_scope)
          else
            categories
          end
        end
    end

    def event_type
      @event_type ||=
        case event_context.to_sym
        in :current
          ITEM_CREATE
        in :pre_setup
          PRE_SETUP_ITEM_CREATE
        in :setup
          SETUP_ITEM_CREATE
        in :close_out
          ROLLOVER_ITEM_CREATE
        end
    end

    delegate :current?, to: :event_context

    attr_reader :event_context
  end
end
