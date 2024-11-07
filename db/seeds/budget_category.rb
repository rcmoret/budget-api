User::Group.find_by!(name: "Initial User Group").then do |group|
  mortgage = Budget::Category.find_or_initialize_by(
    name: "Mortgage",
    slug: "mortgage",
    user_group: group,
    monthly: true,
    expense: true,
    icon: Icon.find_by!(name: "House")
  )

  if mortgage.new_record?
    mortgage.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false,
    )
  end

  cell_phone = Budget::Category.find_or_initialize_by(
    name: "Cell Phone",
    slug: "cell-phone",
    user_group: group,
    monthly: true,
    expense: true,
    icon: Icon.find_by!(name: "Mobile (alt)")
  )

  if cell_phone.new_record?
    cell_phone.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false,
    )
  end

  salary = Budget::Category.find_or_initialize_by(
    name: "Salary",
    slug: "salary",
    user_group: group,
    monthly: true,
    expense: false,
    icon: Icon.find_by!(name: "Money Bill (alt)")
  )

  if salary.new_record?
    salary.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false,
    )
  end

  groceries = Budget::Category.find_or_initialize_by(
    name: "Groceries",
    slug: "groceries",
    user_group: group,
    monthly: false,
    expense: true,
    icon: Icon.find_by!(name: "Shopping Cart")
  )

  if groceries.new_record?
    groceries.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false,
    )
  end

  gas = Budget::Category.find_or_initialize_by(
    name: "Gas",
    slug: "gas",
    user_group: group,
    monthly: false,
    expense: true,
    icon: Icon.find_by!(name: "Gas Pump")
  )

  if gas.new_record?
    gas.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false,
    )
  end

  misc_income = Budget::Category.find_or_initialize_by(
    name: "Misc. Income",
    slug: "misc-income",
    user_group: group,
    monthly: false,
    expense: false,
  )

  if misc_income.new_record?
    misc_income.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: false
    )
  end

  car_insurance = Budget::Category.find_or_initialize_by(
    name: "Car Insurance",
    slug: "car-ins",
    user_group: group,
    monthly: true,
    expense: true,
  )

  if car_insurance.new_record?
    car_insurance.update(
      default_amount: 0,
      key: SecureRandom.hex(6),
      accrual: true
    )
  end
end
