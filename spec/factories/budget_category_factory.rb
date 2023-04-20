FactoryBot.define do
  factory :category, class: "Budget::Category" do
    association :user_group
    default_amount { (-100..0).to_a.sample * 100 }
    sequence(:name) { |n| "Stuff - #{n}" }
    sequence(:slug) { |n| "slug-#{n}" }
    key { SecureRandom.hex(6) }
    accrual { false }

    trait :monthly do
      monthly { true }
    end

    trait :weekly do
      monthly { false }
    end

    trait :expense do
      sequence(:name) { |n| "Expenditures - #{n}" }
      expense { true }
    end

    trait :revenue do
      sequence(:name) { |n| "Income - #{n}" }
      expense { false }
      default_amount { (0..100).to_a.sample * 100 }
    end

    trait :accrual do
      accrual { true }
    end

    trait :with_icon do
      association :icon
    end

    trait :archived do
      archived_at { rand(1..300).days.ago }
    end
  end
end
