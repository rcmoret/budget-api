User::Group.find_by!(name: "Initial User Group").then do |group|
  budget_attributes = [
    {
      slug: "electric-bill",
      amount: ITEM_AMOUNTS.fetch("electric-bill").fetch("base"),
      description: "Big Time Bank",
    },
    {
      slug: "cell-phone",
      amount: ITEM_AMOUNTS.fetch("cell-phone").fetch("base").call,
      description: "Big Time Bank",
    },
    *ITEM_AMOUNTS.fetch("salary").filter_map do |item|
      next unless item.key?("base")

      {
        slug: :salary,
        amount: item.fetch("base"),
        description: "Big Time Bank",
        key: item.fetch("key"),
      }
    end,
    {
      slug: :mortgage,
      amount: ITEM_AMOUNTS.dig("mortgage", "base"),
      description: "Big Time Bank",
    },
    {
      slug: :gas,
      amount: -25_25,
      description: "7-11",
    },
    {
      slug: :gas,
      amount: -15_25,
      description: "7-11",
    },
    {
      slug: "car-ins",
      amount: ITEM_AMOUNTS.dig("car-ins", "base"),
      description: "Zander",
    },
    {
      slug: "cleaning",
      amount: (-3_00 + ITEM_AMOUNTS.dig("cleaning", "base")),
      description: "Big Box",
    },
    {
      slug: "groceries",
      amount: ((rand(2..8) * 10) + ITEM_AMOUNTS.dig("groceries", "base").call),
      description: "Another Big Box",
    },
    {
      slug: "misc-income",
      amount: ITEM_AMOUNTS.dig("misc-income", "base").call,
      description: "Any number of things",
    },
  ]

  checking_account = Account.belonging_to(group).by_slug!(:checking)
  today = Time.current
  month = today.month
  year = today.year
  interval = Budget::Interval.fetch!(group, key: { month: month, year: year })

  budget_attributes.each do |budget_attrs|
    category = Budget::Category.belonging_to(group).by_slug!(budget_attrs[:slug])
    item = Budget::Item.find_by!({
      category: category,
      interval: interval,
      key: budget_attrs[:key],
    }.compact)
    Transaction::Entry.create!(
      key: KeyGenerator.call,
      account: checking_account,
      clearance_date: today,
      description: budget_attrs[:description],
      details_attributes: [
        {
          key: KeyGenerator.call,
          budget_item: item,
          amount: budget_attrs[:amount],
        },
      ]
    )
  end
  category = Budget::Category.belonging_to(group).by_slug!("groceries")
  item = Budget::Item.find_by!(category: category, interval: interval)
  Transaction::Entry.create!(
    key: KeyGenerator.call,
    account: checking_account,
    clearance_date: today,
    description: "Costco",
    details_attributes: [
      {
        key: KeyGenerator.call,
        budget_item: item,
        amount: -22_00,
      },
      {
        key: KeyGenerator.call,
        amount: -10_44,
      },
    ]
  )
end
