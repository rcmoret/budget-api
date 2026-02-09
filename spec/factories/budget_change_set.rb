FactoryBot.define do
  factory :budget_change_set, class: "Budget::ChangeSet" do
    association :interval, factory: :budget_interval

    trait :adjust do
      type_key { :adjust }
    end
  end
end
