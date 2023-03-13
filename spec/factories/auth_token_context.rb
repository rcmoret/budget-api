FactoryBot.define do
  factory :auth_token_context, class: "Auth::Token::Context" do
    association :user
    key { SecureRandom.hex(6) }
    ip_address { Faker::Internet.ip_v4_address }
    expires_at { 24.hours.from_now }

    trait :manually_expired do
      manually_expired_at { 1.minute.ago }
    end
  end
end
