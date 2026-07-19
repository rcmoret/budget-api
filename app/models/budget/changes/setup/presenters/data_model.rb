module Budget
  module Changes
    class Setup
      module Presenters
        class DataModel
          CATEGORY_ATTRIBUTES = %i[
            key
            name
            slug
            events
            default_amount
            is_expense
            is_monthly
            is_accrual
            is_per_diem_enabled
            icon_key
            icon_class_name
            upcoming_maturity_intervals
            archived_at
          ].freeze

          EVENT_ATTRIBUTES = %i[
            event_type
            amount
            budget_item_key
            updated_amount
            object_key
            previously_budgeted
            spent
            adjustment
            flags
          ].freeze

          CategoryStruct = Data.define(*CATEGORY_ATTRIBUTES) do
            include Comparable

            def day_to_day_expense? = is_expense && !is_monthly
            def monthly_expense? = is_expense && is_monthly
            def revenue? = !is_expense
            def unreviewed? = events.any? { |ev| !!ev.flags[:unreviewed] }
            def reviewed? = events.none? { |ev| !!ev.flags[:unreviewed] }
            def sum = events.sum(&:updated_amount)

            def to_h
              super.merge(events: events.map(&:to_h))
            end

            def sort_int
              return 0 if revenue?
              return 1 if monthly_expense?

              2
            end

            def <=>(other)
              if sort_int == other.sort_int
                name <=> other.name
              else
                sort_int <=> other.sort_int
              end
            end

            def budget_item_keys
              events.map(&:budget_item_key)
            end
          end

          EventStruct = Data.define(*EVENT_ATTRIBUTES) do
            def adjustment_hash
              { budget_item_key => adjustment }
            end

            def non_zero?
              !!adjustment[:cents].nonzero?
            end

            def zero?
              adjustment[:cents].zero?
            end

            def create_event?
              Budget::EventTypes::CREATE_EVENTS.include?(event_type)
            end

            def adjust_event?
              Budget::EventTypes::ADJUST_EVENTS.include?(event_type)
            end
          end

          def initialize(change)
            @change = change
            @categories =
              change.events_data.fetch("categories").map do |category_data|
                category_struct(category_data)
              end.sort!
          end

          attr_reader :change, :categories

          attr_accessor :slug

          def with(slug:)
            @slug = slug
            self
          end

          delegate :find, to: :categories

          def category
            if slug.blank?
              categories.first
            else
              find { |category| category.slug == slug } || categories.first
            end
          end

          def slugs
            categories.map(&:slug)
          end

          private

          def category_struct(category_data)
            category_data.deep_symbolize_keys!

            category_data[:events].map! do |ev|
              next ev unless ev.is_a? Hash

              EventStruct.new(*ev.values_at(*EVENT_ATTRIBUTES))
            end
            CategoryStruct.new(*category_data.values_at(*CATEGORY_ATTRIBUTES))
          end
        end
      end
    end
  end
end
