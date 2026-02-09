# frozen_string_literal: true

module Forms
  module Budget
    class DraftChangesForm
      def initialize(interval, changes: [])
        @interval = interval
        @changes = changes.map do |change|
          DraftChangeForm.new(interval, **change)
        end
      end

      def errors
        changes.each_with_object([]) do |change, errs|
          errs << { change.budget_item_key => change.errors } if change.invalid?
        end
      end

      attr_reader :changes

      private

      attr_reader :interval
    end
  end
end
