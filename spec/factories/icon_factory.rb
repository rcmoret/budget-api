FactoryBot.define do
  factory :icon do
    sequence(:class_name) { |n| "fa fa-icon-#{n}" }
    sequence(:name) { |n| "foo_icon_#{n}" }
    key { SecureRandom.hex(6) }
  end
end
