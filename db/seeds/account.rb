User::Group.find_by!(name: "Initial User Group").then do |group|
  regular_account = group.accounts.find_or_initialize_by(
    name: "Checking",
    slug: "checking",
    cash_flow: true,
    priority: 100,
  )

  regular_account.update!(key: KeyGenerator.call) if regular_account.new_record?

  if regular_account.transactions.none?
    regular_account.transactions.create!(
      clearance_date: 40.days.ago,
      description: "Initial Balance",
      key: KeyGenerator.call,
      details_attributes: [
        { amount: 1_400_00, key: KeyGenerator.call },
      ]
    )
  end

  savings_account = group.accounts.find_or_initialize_by(
    name: "Savings",
    slug: "savings",
    cash_flow: false,
    priority: 200,
  )

  savings_account.update!(key: KeyGenerator.call) if savings_account.new_record?

  if savings_account.transactions.none?
    savings_account.transactions.create!(
      clearance_date: 45.days.ago,
      description: "Initial Balance",
      key: KeyGenerator.call,
      budget_exclusion: true,
      details_attributes: [
        { amount: 2_800_00, key: KeyGenerator.call },
      ]
    )
  end

  archived_account = group.accounts.find_or_initialize_by(
    name: "Defunct Account",
    slug: "defunct",
    cash_flow: true,
    priority: 300,
  )

  if archived_account.new_record?
    archived_account.update!(key: KeyGenerator.call,
      archived_at: 1.day.ago)
  end
end
