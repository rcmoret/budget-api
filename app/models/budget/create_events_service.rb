# frozen_string_literal: true

module Budget
  class CreateEventsService
    include EventTypes

    def self.call(...)
      new(...).call
    end

    def initialize(interval:, event_context: :current, scopes: [], excluded_keys: [])
      @interval = interval
      @event_context = event_context
      @excluded_keys = excluded_keys
      @scopes = scopes
    end

    def call
      category_scope.map do |category|
        {
          name: category.name,
          events: event_hashes_for(category),
        }
      end
    end

    delegate :user_group, to: :interval

    attr_reader :interval, :excluded_keys

    private

    def event_hashes_for(category)
      event_types.map do |event_type|
        {
          amount: 0,
          budget_category_key: category.key,
          budget_item_key: SecureRandom.hex(6),
          event_type: event_type,
          key: SecureRandom.hex(6),
          data: {},
        }
      end
    end

    def items_scope
      ::Budget::Item
        .belonging_to(user_group)
        .where(interval: interval)
    end

    def excluded_category_ids
      scope = user_group.budget_categories.weekly
      scope = scope.or(user_group.budget_categories.where.not(key: excluded_keys)) if excluded_keys.any?

      scope
        .joins(:items)
        .merge(items_scope)
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
        .then do |init_scope|
          if excluded_category_ids.any?
            init_scope.where.not(id: excluded_category_ids)
          else
            init_scope
          end
        end
    end

    def category_scope
      @category_scope ||= @scopes.reduce(initial_scope) do |categories, named_scope|
        case named_scope.to_sym
        when *CATEGORY_SCOPES
          categories.public_send(named_scope)
        else
          categories
        end
      end
    end

    def event_types
      case @event_context
      when *CREATE_EVENTS
        [@event_context]
      when :pre_setup
        [PRE_SETUP_ITEM_CREATE, PRE_SETUP_MULTI_ITEM_ADJUST_CREATE]
      when :setup
        [SETUP_ITEM_CREATE]
      when :close_out
        [ROLLOVER_ITEM_CREATE, ROLLOVER_ITEM_CREATE]
      else
        [ITEM_CREATE, MULTI_ITEM_ADJUST_CREATE]
      end
    end
  end
end
