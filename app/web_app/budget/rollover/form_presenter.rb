# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      class FormPresenter
        include Rails.application.routes.url_helpers

        GROUP_LABELS = {
          accruals: "Accruals",
          revenues: "Revenues",
          expenses: "Expenses",
        }.freeze

        CategoryLink = Data.define(
          :key,
          :name,
          :slug,
          :unapplied_amount,
          :is_reviewed,
          :is_selected,
          :route,
          :items
        )

        GroupStruct = Data.define(:key, :label, :categories) do
          delegate :count, to: :categories

          def name = label.singularize
          def unreviewed_count = categories.count { |cat| !cat.is_reviewed }
          def reviewed_count = categories.count(&:is_reviewed)
          def selected? = categories.any?(&:is_selected)

          def sum
            categories.sum(Money.from_cents(0), &:unapplied_amount)
          end
        end

        def initialize(data_model, budget_month)
          @data_model = data_model
          @budget_month =
            ::WebApp::Budget::BudgetMonthPresenter
            .new(budget_month)
        end

        delegate :categories, :category, :slugs, to: :data_model

        delegate :month, :year, to: :budget_month

        def featured_category
          category&.to_h
        end

        # Revenues are left out when there aren't any; accruals and
        # expenses are always present.
        def groups
          GROUP_LABELS.filter_map do |key, label|
            links = categories
                    .select { |cat| cat.group == key }
                    .map { |cat| category_link(cat) }
            next if key == :revenues && links.empty?

            GroupStruct.new(key: key.to_s, label:, categories: links)
          end
        end

        delegate :all_reviewed?, :submittable?, to: :data_model

        # Where the remainder (what isn't rolled over) goes: an expense
        # category when it's negative, a revenue when positive, nowhere
        # when it's zero. The target is a create event in the upcoming
        # month.
        def unapplied
          total = data_model.unapplied_total
          upcoming = budget_month.next_month

          {
            total:,
            scope: unapplied_scope(total),
            target_event: data_model.unapplied_target_event,
            is_target_valid: data_model.unapplied_target_valid?,
            is_ready: all_reviewed?,
            target_month: upcoming.month,
            target_year: upcoming.year,
          }
        end

        def slug
          category&.slug
        end

        def current_category_href
          show_path(slug)
        end

        def next_category
          categories.at(next_index)
        end

        def previous_category
          categories.at(previous_index)
        end

        def next_unreviewed_category
          categories.rotate(next_index).reject(&:reviewed?).first
        end

        def previous_unreviewed_category
          categories
            .rotate(previous_index)
            .reject(&:reviewed?)
            .reverse
            .first
        end

        %i[
          next_category
          previous_category
          next_unreviewed_category
          previous_unreviewed_category
        ].each do |name|
          define_method(:"#{name}_name") { public_send(name)&.name }
          define_method(:"#{name}_slug") { public_send(name)&.slug }
          define_method(:"#{name}_href") do
            public_send(name)&.then { |cat| show_path(cat.slug) }
          end
        end

        attr_reader :budget_month

        private

        attr_reader :data_model

        def unapplied_scope(total)
          return if total.zero?

          total.negative? ? "expenses" : "revenues"
        end

        def category_link(cat)
          CategoryLink.new(
            key: cat.key,
            name: cat.name,
            slug: cat.slug,
            unapplied_amount: cat.unapplied_amount,
            is_reviewed: cat.reviewed?,
            is_selected: cat.slug == slug,
            route: show_path(cat.slug),
            items: cat.items.map do |item|
              { is_reviewed: item["is_reviewed"], is_valid: item["is_valid"] }
            end
          )
        end

        def current_index
          slugs.index(slug).to_i
        end

        def next_index
          return 0 if slugs.empty?

          (current_index + 1) % slugs.size
        end

        def previous_index
          current_index - 1
        end

        def show_path(category_slug)
          budget_rollover_form_path(month:, year:, slug: category_slug)
        end
      end
    end
  end
end
