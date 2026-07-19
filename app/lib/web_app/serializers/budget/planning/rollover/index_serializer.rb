module WebApp
  module Serializers
    module Budget
      module Planning
        module Rollover
          class IndexSerializer
            include Alba::Resource
            include Mixins::NotificationsConcern

            # rubocop:disable Metrics/BlockLength
            one :featured_category, source: proc { category } do
              attributes :key,
                :name,
                :slug,
                :is_expense,
                :is_monthly,
                :is_accrual,
                :is_per_diem_enabled,
                :icon_key,
                :icon_class_name,
                :archived_at
              one :default_amount, resource: MonetaryAmountSerializer

              attribute :upcoming_maturity_intervals do |category|
                Array.wrap(category.upcoming_maturity_intervals)
              end

              many :events do
                attributes :event_type,
                  :adjustment,
                  :budget_item_key

                one :amount, resource: MonetaryAmountSerializer
                one :updated_amount, resource: MonetaryAmountSerializer
                one :previously_budgeted, resource: MonetaryAmountSerializer
                one :transactions_total,
                  resource: MonetaryAmountSerializer,
                  source: proc { spent },
                  &:spent
                one :flags, source: proc { flags } do
                  attributes :rollover_all,
                    :rollover_none,
                    :show_default_suggestion,
                    :unreviewed,
                    :is_valid

                  transform_keys :lower_camel
                end

                transform_keys :lower_camel
              end
              transform_keys :lower_camel
            end
            # rubocop:enable Metrics/BlockLength

            attribute :is_submittable, &:submittable?
            # one :budget_month,
            #   resource: WebApp::Budget::BudgetMonthSerializer

            nested_attribute :neighbor_links do
              attributes :next_unreviewed_category_href,
                :next_unreviewed_category_slug,
                :current_category_href,
                :next_category_href,
                :next_category_slug,
                :previous_category_href,
                :previous_category_slug,
                :previous_unreviewed_category_href,
                :previous_unreviewed_category_slug

              transform_keys :lower_camel
            end

            # attribute :metadata,
            #   resource: ::WebApp::MetadataSerializer,
            #   &:metadata

            nested_attribute :groups do
              many :revenues,
                resource: ::Budget::Changes::Rollover::Resources::GroupResource
              many :fixed_expenses,
                resource: ::Budget::Changes::Rollover::Resources::GroupResource
              many :variable_expenses,
                resource: ::Budget::Changes::Rollover::Resources::GroupResource

              transform_keys :lower_camel
            end

            transform_keys :lower_camel
          end
        end
      end
    end
  end
end
