FactoryBot.define do
  factory :account do
    association :user_group, factory: %i[user_group with_user]
    sequence(:name) { |n| "#{n.ordinalize} City Bank" }
    sequence(:slug) { |n| "slug-#{n.ordinalize}" }
    sequence :priority
    key { KeyGenerator.call }

    trait :cash_flow do
      cash_flow { true }
    end

    factory :savings_account do
      non_cash_flow
    end

    trait :non_cash_flow do
      cash_flow { false }
    end

    trait :archived do
      archived_at { 1.year.ago }
    end
  end
end
