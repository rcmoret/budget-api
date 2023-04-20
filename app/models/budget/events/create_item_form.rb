module Budget
  module Events
    class CreateItemForm < FormBase
      include Messages

      def self.applicable_event_types
        CREATE_EVENTS
      end

      validates :event_type, inclusion: { in: CREATE_EVENTS }
      validates :category, presence: true
      validates :amount, numericality: { only_integer: true }
      validates :amount,
                numericality: {
                  less_than_or_equal_to: 0,
                  message: EXPENSE_AMOUNT_VALIDATION_MESSAGE,
                },
                if: :expense?
      validates :amount,
                numericality: {
                  greater_than_or_equal_to: 0,
                  message: REVENUE_AMOUNT_VALIDATION_MESSAGE,
                },
                if: :revenue?
      validates :budget_item_key, presence: true, length: { is: 12 }

      def initialize(current_user, params)
        super(current_user, params)
        @amount = params[:amount]
        @month = params[:month].to_i
        @year = params[:year].to_i
        @budget_category_key = params[:budget_category_key]
      end

      def save
        return false unless valid?

        ItemEvent.transaction do
          create_interval! unless interval.persisted?
          create_item!
          create_event!
        end

        errors.none?
      end

      def to_s
        "create_item_form"
      end

      private

      attr_reader :amount, :budget_category_key, :month, :year

      alias event_amount amount

      def create_interval!
        return if interval.save

        promote_errors(interval.errors)
        raise ActiveRecord::Rollback
      end

      def create_item!
        return if budget_item.save

        promote_errors(budget_item.errors)
        raise ActiveRecord::Rollback
      end

      def create_event!
        return if event.save

        promote_errors(event.errors)
      end

      def budget_item
        @budget_item ||= Budget::Item.new(interval: interval, category: category, key: budget_item_key)
      end

      def category
        @category ||= Budget::Category.fetch(user: current_user, key: budget_category_key)
      end

      def interval
        @interval ||= Budget::Interval.fetch(user: current_user, key: { month: month, year: year })
      end

      def expense?
        return false if category.nil?

        category.expense?
      end

      def revenue?
        return false if category.nil?

        category.revenue?
      end

      def budget_item_event_type
        @budget_item_event_type ||=
          if interval.set_up?
            ItemEventType.send(event_type)
          else
            ItemEventType.send(pre_setup_event_type)
          end
      end

      def pre_setup_event_type
        case event_type
        when ITEM_CREATE
          PRE_SETUP_ITEM_CREATE
        when MULTI_ITEM_ADJUST_CREATE, PRE_SETUP_MULTI_ITEM_ADJUST_CREATE
          PRE_SETUP_MULTI_ITEM_ADJUST_CREATE
        else
          event_type
        end
      end
    end
  end
end
