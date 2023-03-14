FactoryBot.define do
  factory :user_event, class: "User::Event" do
    actor { create(:user) }
    target_user { actor }
    user_event_type { User::EventType.for(Faker::Lorem.words(number: 3).join("_")) }
    data { {} }
    key { SecureRandom.hex(6) }
  end
end
