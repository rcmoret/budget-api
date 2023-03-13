FactoryBot.define do
  factory :transfer do
    key { SecureRandom.hex(6) }
    association :from_transaction, factory: :transaction_entry
    association :to_transaction, factory: :transaction_entry
  end
end
