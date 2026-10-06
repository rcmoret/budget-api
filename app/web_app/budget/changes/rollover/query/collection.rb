module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          class Collection
            def initialize(base_interval)
              @base_interval = base_interval
              @target_interval = base_interval.next
              @user_group = base_interval.user_group
            end

            def all_details
              @all_details ||= base_details_by_key.map do |key, review_items|
                Result.build_from_details(
                  review_items.first,
                  review_items,
                  target_details_by_key.fetch(key, [])
                )
              end
            end

            def base_details_by_key
              @base_details_by_key ||=
                base_details.group_by(&:budget_category_key)
            end

            def target_details_by_key
              @target_details_by_key ||=
                target_details.group_by(&:budget_category_key)
            end

            def details_by_category_key
              [ *base_details.to_a, *target_details.to_a ]
                .group_by(&:budget_category_slug)
            end

            def base_details
              @base_details ||=
                ::Budget::Details::Base
                .active
                .belonging_to(user_group)
                .where(interval: base_interval)
                .reviewable
            end

            def target_details
              @target_details ||=
                ::Budget::Details::Base
                .belonging_to(user_group)
                .where(interval: target_interval)
                .where(budget_category_key: category_keys)
            end

            def category_keys
              @category_keys ||=
                base_details.distinct.pluck(:budget_category_key)
            end

            attr_reader :base_interval, :target_interval, :user_group
          end
        end
      end
    end
  end
end
