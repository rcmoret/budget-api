FactoryBot.define do
  factory :budget_item, class: "Budget::Item" do
    association :category
    association :interval, factory: :budget_interval

    key { SecureRandom.hex(6) }

    trait :expense do
      association :category, factory: %i[category expense]
    end

    trait :revenue do
      association :category, factory: %i[category revenue]
    end

    factory :monthly_item do
      association :category, factory: %i[category monthly revenue]
    end

    factory :monthly_expense do
      association :category, factory: %i[category monthly expense]
    end

    factory :monthly_revenue do
      association :category, factory: %i[category monthly revenue]
    end

    factory :weekly_item do
      association :category, factory: %i[category weekly]
    end

    factory :weekly_expense do
      association :category, factory: %i[category weekly expense]
    end

    factory :weekly_revenue do
      association :category, factory: %i[category weekly revenue]
    end
  end
end
