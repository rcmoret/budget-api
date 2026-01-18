module Budget
  module Changes
    class Setup
      module Resource
        module Index
          class CategoryResource
            include Alba::Resource

            attributes :key,
                       :name,
                       :slug,
                       :default_amount,
                       :is_expense,
                       :is_monthly,
                       :is_accrual,
                       :is_per_diem_enabled,
                       :icon_key,
                       :icon_class_name,
                       :archived_at

            attribute(:events) do |object|
              object.events.map do |ev|
                ev.flags.transform_keys { |k| k.to_s.camelize(:lower) }
              end
            end

            transform_keys :lower_camel
          end
        end
      end
    end
  end
end
