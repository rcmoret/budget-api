# frozen_string_literal: true

module WebApp
  module Budget
    module Setup
      module Presenters
        class IndexPresenter
          include Rails.application.routes.url_helpers

          GroupStruct = Data.define(:label, :categories, :is_selected, :scopes)

          def initialize(data_model, budget_month)
            @data_model = data_model
            @budget_month =
              ::WebApp::Budget::Presenters::BudgetMonthPresenter
              .new(budget_month)
          end

          delegate :categories,
            :category,
            :slug,
            :slugs,
            to: :data_model

          delegate :month, :year, to: :budget_month

          def budget_total
            categories.sum(&:sum)
          end

          def revenues
            collection = categories.select(&:revenue?)

            GroupStruct.new(
              label: "Revenues",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: [ :revenues ]
            )
          end

          def variable_expenses
            collection = categories.select(&:day_to_day_expense?)

            GroupStruct.new(
              label: "Variable Expenses",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: %i[weekly expenses]
            )
          end

          def fixed_expenses
            collection = categories.select(&:monthly_expense?)

            GroupStruct.new(
              label: "Fixed Expenses",
              categories: collection.to_a,
              is_selected: collection.map(&:slug).include?(slug),
              scopes: %i[monthly expenses]
            )
          end

          def submittable?
            categories.all?(&:reviewed?)
          end

          def next_category_href
            show_path(next_category_slug)
          end

          def next_category_name
            categories.at(next_index)&.name
          end

          def next_category_slug
            slugs.rotate(next_index).first
          end

          def next_unreviewed_category_href
            show_path(next_unreviewed_category_slug)
          end

          def next_unreviewed_category
            categories.rotate(next_index).reject(&:reviewed?).first || category
          end

          delegate :name,
            :slug,
            to: :next_unreviewed_category,
            prefix: true
          delegate :name,
            :slug,
            to: :previous_unreviewed_category,
            prefix: true

          def previous_unreviewed_category_href
            show_path(previous_unreviewed_category_slug)
          end

          def previous_unreviewed_category
            categories
              .rotate(previous_index)
              .reject(&:reviewed?)
              .reverse
              .first || category
          end

          def previous_category_slug
            slugs.rotate(previous_index).first
          end

          def previous_category_name
            categories.at(previous_index)&.name
          end

          def previous_category_href
            show_path(previous_category_slug)
          end

          def current_index
            slugs.index(slug).to_i
          end

          def finish_setup_route
            budget_finish_setup_path(
              month:,
              year:
            )
          end

          def next_index
            (current_index + 1).then do |index|
              [ index, (0 if index == slugs.size) ].compact.min
            end
          end

          def previous_index
            current_index - 1
          end

          def current_category_href
            show_path(slug)
          end

          def show_path(category_slug)
            budget_setup_form_path(
              month:,
              year:,
              slug: category_slug
            )
          end

          attr_reader :data_model, :budget_month
        end
      end
    end
  end
end
