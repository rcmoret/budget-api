FactoryBot.define do
  factory :user_group, class: "User::Group" do
    sequence(:name) { |n| "user_group_#{n}" }
    sequence(:primary_email) { |n| "user_group_#{n}@example.com" }
    key { SecureRandom.hex(6) }

    trait :with_user do
      users { [association(:user)] }
    end
  end
end
