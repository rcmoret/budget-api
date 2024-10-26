User::Group.find_by!(name: "Initial User Group").then do |group|
  budget_attributes = [
    {
      slug: :mortgage,
      amount: -925_00,
      description: "Big Time Bank",
    },
    {
      slug: :gas,
      amount: -25_25,
      description: "7-11",
    },
  ]

  checking_account = Account.belonging_to(group).by_slug!(:checking)
  today = Time.current
  month = today.month
  year = today.year
  interval = Budget::Interval.fetch!(group, key: { month: month, year: year })

  budget_attributes.each do |budget_attrs|
    category = Budget::Category.belonging_to(group).by_slug!(budget_attrs[:slug])
    item = Budget::Item.find_by!(category: category, interval: interval)
    Transaction::Entry.create!(
      key: SecureRandom.hex(6),
      account: checking_account,
      clearance_date: today,
      description: budget_attrs[:description],
      details_attributes: [
        {
          key: SecureRandom.hex(6),
          budget_item: item,
          amount: budget_attrs[:amount],
        },
      ]
    )
  end
end
