FactoryBot.define do
  factory :transaction_detail, class: "Transaction::Detail" do
    key { SecureRandom.hex(6) }
    association :budget_item
    association :entry, factory: :transaction_entry
    amount do
      (-10_000..10_000).to_a.reject(&:zero?).sample
    end

    trait :null_budget_item do
      budget_item { nil }
    end
  end
end
