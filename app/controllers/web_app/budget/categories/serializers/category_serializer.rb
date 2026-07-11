# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      module Serializers
        class CategorySerializer
          include Alba::Resource

          attributes :key,
            :archived_at,
            :default_amount,
            :icon_class_name,
            :icon_key,
            :is_per_diem_enabled,
            :name,
            :object_key,
            :slug

          attribute(:is_monthly, &:monthly?)
          attribute(:is_expense, &:expense?)
          attribute(:is_archived, &:archived?)
          attribute(:is_accrual, &:accrual?)
          attribute(:created_at) do |category|
            category
              .created_at
              .in_time_zone(params[:timezone])
              .strftime("%B %-d, %Y %Z")
          end

          def archived_at(category)
            return if category.archived_at.nil?

            category
              .archived_at
              .in_time_zone(params[:timezone])
              .strftime("%B %-d, %Y %Z")
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
