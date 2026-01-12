module Budget
  module Changes
    class Setup
      module Presenters
        class DataModel
          GroupStruct = Data.define(:label, :categories, :is_selected, :scopes)

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
              !zero?
            end

            def zero?
              adjustment[:cents].zero?
            end

            def adjust_event?
              Budget::EventTypes::ADJUST_EVENTS.include?(event_type)
            end
          end

          def initialize(change)
            @change = change
            @categories = change.events_data.fetch("categories").map(&:deep_symbolize_keys).map do |category_data|
              category_data[:events] = category_data[:events].map do |ev|
                EventStruct.new(*ev.values_at(*EVENT_ATTRIBUTES))
              end
              CategoryStruct.new(*category_data.values_at(*CATEGORY_ATTRIBUTES))
            end.sort!
          end

          attr_reader :change, :categories, :groups, :category_slug, :metadata

          attr_accessor :slug

          def with(slug:)
            @slug = slug
            self
          end

          delegate :find, to: :categories

          IndexStruct = Data.define(
            :revenues,
            :monthly_expenses,
            :day_to_day_expenses,
            :budget_total,
            :month,
            :year,
            :selected_category,
            :next_category_slug,
            :previous_category_slug,
            :is_submittable
          )

          def index_serializer
            IndexStruct.new(
              revenues: revenues,
              monthly_expenses: monthly_expenses,
              day_to_day_expenses: day_to_day_expenses,
              budget_total: categories.sum(&:sum),
              month: change.month,
              year: change.year,
              selected_category: selected_category_data,
              next_category_slug: next_category_slug,
              previous_category_slug: previous_category_slug,
              is_submittable: categories.all?(&:reviewed?)
            )
          end

          def selected_category_data
            category.to_h
          end

          def next_category_slug
            index = (slugs.index(slug).to_i + 1).then do |ndx|
              [ndx, (0 if ndx == slugs.size)].compact.min
            end

            slugs.rotate(index).first
          end

          def previous_category_slug
            index = (slugs.index(slug).to_i - 1)

            slugs.rotate(index).first
          end

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

          def revenues
            collection = categories.select(&:revenue?)

            GroupStruct.new(
              label: "Revenues",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: [:revenues]
            )
          end

          def day_to_day_expenses
            collection = categories.select(&:day_to_day_expense?)

            GroupStruct.new(
              label: "Day-to-Day Expenses",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: %i[weekly expenses]
            )
          end

          def monthly_expenses
            collection = categories.select(&:monthly_expense?)

            GroupStruct.new(
              label: "Monthly Expenses",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: %i[monthly expenses]
            )
          end
        end
      end
    end
  end
end
