# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class CategorySerializer < ApplicationSerializer
        MaturityIntervalSerializer = Class.new(ApplicationSerializer) do
          attributes :month, :year
        end
        private_constant :MaturityIntervalSerializer

        def initialize(category, current_user_profile:)
          super(category)
          @current_user_profile = current_user_profile
        end

        attributes :key, :slug, :name, :default_amount, :is_per_diem_enabled, :icon_class_name, :icon_key
        attribute :archived_at, on_render: proc { |timestamp| render_date_time(timestamp, "%B %-d, %Y") }
        attribute :created_at, on_render: proc { |timestamp| render_date_time(timestamp, "%B %-d, %Y %Z") }
        attribute :is_archived, alias_of: :archived?
        attribute :is_accrual, alias_of: :accrual?
        attribute :is_expense, alias_of: :expense?
        attribute :is_monthly, alias_of: :monthly?
        attribute :maturity_intervals, each_serializer: MaturityIntervalSerializer, conditional: :accrual?

        private

        attr_reader :current_user_profile
      end
    end
  end
end
