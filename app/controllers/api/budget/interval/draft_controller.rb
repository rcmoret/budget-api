# frozen_string_literal: true

module API
  module Budget
    module Interval
      class DraftController < BaseController
        include HasBudgetInterval
        before_action :validate_form!

        def call
          render json: serializer.render
        end

        private

        def serializer
          API::Budget::Interval::DraftSerializer.new(interval, changes: form.changes)
          # DraftSerializer.new(interval, changes: form.changes)
        end

        def form
          @form ||= Forms::Budget::DraftChangesForm.new(interval, changes: change_params)
        end

        def change_params
          params.require(:changes).map do |change|
            change
              .permit(:amount, :budget_item_key, :budget_category_key)
              .to_h
              .symbolize_keys
          end
        end

        def validate_form!
          return if form.errors.none?

          render json: form.errors, status: :unprocessable_entity
        end
      end
    end
  end
end
