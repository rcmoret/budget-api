# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class ShowSerializer < ApplicationSerializer
        MaturityIntervalSerializer = Class.new(ApplicationSerializer) do
          attributes :month, :year
        end
        private_constant :MaturityIntervalSerializer

        attributes :key, :slug, :name, :default_amount, :is_per_diem_enabled, :icon_class_name, :icon_key
        attribute :archived_at, on_render: proc { |timestamp| timestamp&.strftime("%B %-d, %Y") }
        attribute :is_archived, alias_of: :archived?
        attribute :is_accrual, alias_of: :accrual?
        attribute :is_expense, alias_of: :expense?
        attribute :is_monthly, alias_of: :monthly?
        attribute :maturity_intervals, each_serializer: MaturityIntervalSerializer, conditional: :accrual?
      end
    end
  end
end
