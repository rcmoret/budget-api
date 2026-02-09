module Budget
  module Changes
    class Setup
      module Resources
        class CategoryResource
          include Alba::Resource

          attributes :key,
            :name,
            :slug,
            :default_amount,
            :icon_class_name,
            :icon_key,
            :is_accrual,
            :is_expense,
            :is_monthly,
            :is_per_diem_enabled
          attribute(:archived_at) { nil }
          attributes :upcoming_maturity_intervals,
            if: proc { |category| category.is_accrual }

          many :events, resource: ItemResource
        end
      end
    end
  end
end
