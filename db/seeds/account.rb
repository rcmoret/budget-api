User::Group.find_by!(name: "Initial User Group").then do |group|
  regular_account = group.accounts.find_or_initialize_by(
    name: "Checking",
    slug: "checking",
    cash_flow: true,
    priority: 100,
  )

  regular_account.update!(key: SecureRandom.hex(6)) if regular_account.new_record?

  if regular_account.transactions.none?
    regular_account.transactions.create!(
      clearance_date: 1.day.ago,
      description: "Initial Balance",
      key: SecureRandom.hex(6),
      details_attributes: [
        { amount: 1_400_00, key: SecureRandom.hex(6) },
      ]
    )
  end

  savings_account = group.accounts.find_or_initialize_by(
    name: "Savings",
    slug: "savings",
    cash_flow: false,
    priority: 200,
  )

  savings_account.update!(key: SecureRandom.hex(6)) if savings_account.new_record?

  if savings_account.transactions.none?
    savings_account.transactions.create!(
      clearance_date: 1.day.ago,
      description: "Initial Balance",
      key: SecureRandom.hex(6),
      budget_exclusion: true,
      details_attributes: [
        { amount: 2_800_00, key: SecureRandom.hex(6) },
      ]
    )
  end

  archived_account = group.accounts.find_or_initialize_by(
    name: "Defunct Account",
    slug: "defunct",
    cash_flow: true,
    priority: 300,
  )

  archived_account.update!(key: SecureRandom.hex(6), archived_at: 1.day.ago) if archived_account.new_record?
end
