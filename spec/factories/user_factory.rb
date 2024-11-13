FactoryBot.define do
  factory :user, class: "User::Profile" do
    sequence(:email) { |n| "user-#{n}@example.com" }
    password { Faker::Internet.password }
    password_confirmation { password }
    key { SecureRandom.hex(6) }
    association :user_group
  end
end
