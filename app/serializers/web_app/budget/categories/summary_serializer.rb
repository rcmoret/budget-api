# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class SummarySerializer < ApplicationSerializer
        attribute :transactions_total, on_render: ->(num) { num / 100.0 }
        attribute :budgeted, on_render: ->(num) { num / 100.0 }
        attribute :month
        attribute :year
      end
    end
  end
end
