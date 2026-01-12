FactoryBot.define do
  factory :transfer do
    key { KeyGenerator.call }
    association :from_transaction, factory: :transaction_entry
    association :to_transaction, factory: :transaction_entry
  end
end
