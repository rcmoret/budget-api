# frozen_string_literal: true

module WebApp
  module Budget
    module Rollover
      module Serializers
        class IndexSerializer < ::Serializers::SubjectSerializer
          class CategoryResource
            include Alba::Resource

            attributes :key,
              :name,
              :slug,
              :is_reviewed,
              :is_selected,
              :route,
              unapplied_amount: :money

            many :items do
              attributes :is_reviewed, :is_valid
              transform_keys :lower_camel
            end

            transform_keys :lower_camel
          end

          class GroupResource
            include Alba::Resource

            attributes :key, :label, :name
            many :categories, resource: CategoryResource

            nested_attribute :metadata do
              attributes :count, sum: :money
              attribute :unreviewed, &:unreviewed_count
              attribute :is_reviewed, &:reviewed_count
              attribute :is_selected, &:selected?

              transform_keys :lower_camel
            end

            transform_keys :lower_camel
          end

          # The stored category data is already serialized (see
          # Budget::Changes::Rollover::Query::Result), so only its keys need
          # transforming.
          attribute :featured_category do |presenter|
            presenter.featured_category&.deep_transform_keys do |key|
              key.to_s.camelize(:lower)
            end
          end

          attribute :groups do |presenter|
            presenter.groups.to_h do |group|
              [ group.key.camelize(:lower), GroupResource.new(group).to_h ]
            end
          end

          attribute :is_submittable, &:submittable?

          attribute :unapplied do |presenter|
            presenter
              .unapplied
              .then do |data|
                data.merge(
                  total: ::Serializers::MoneySerializer.new(data[:total]).to_h
                )
              end
              .deep_transform_keys { |key| key.to_s.camelize(:lower) }
          end
          one :budget_month,
            resource: ::WebApp::Budget::Serializers::BudgetMonthSerializer

          nested_attribute :neighbor_links do
            attributes :current_category_href,
              :next_category_href,
              :next_category_name,
              :next_category_slug,
              :previous_category_href,
              :previous_category_name,
              :previous_category_slug,
              :next_unreviewed_category_href,
              :next_unreviewed_category_name,
              :next_unreviewed_category_slug,
              :previous_unreviewed_category_href,
              :previous_unreviewed_category_name,
              :previous_unreviewed_category_slug

            transform_keys :lower_camel
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
