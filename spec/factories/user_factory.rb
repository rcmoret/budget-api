FactoryBot.define do
  factory :user, class: "User::Account" do
    sequence(:email) { |n| "user-#{n}@example.com" }
    encrypted_password { "try-h@cK-th!$" }
    key { SecureRandom.hex(6) }
    association :user_group
  end
end
