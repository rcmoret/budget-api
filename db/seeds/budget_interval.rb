CATEGORIES = {
  "mortgage" => [
    { amount: -180_000 },
  ],
  "cell-phone" => {
    amount: -> { (200..230).to_a.sample * -100 },
  },
  "salary" => [
    { amount: 250_000 },
  ],
  "gas" => {
    amount: -> { (90..110).to_a.sample * -100 },
  },
}.freeze

def amount_handler(amount)
  case amount
  when Integer
    amount
  when Proc
    amount.call
  end
end

def event_form(user, interval, amount, category_key)
  Forms::Budget::EventsForm.new(
    user,
    amount: amount,
    month: interval.month,
    year: interval.year,
    budget_category_key: category_key,
  )
end

def create_budget(user, interval)
  CATEGORIES.each_pair do |slug, attributes|
    Budget::Category.by_slug(slug).then do |category|
      # binding.pry
      Array.wrap(attributes).each do |item_attrs|
        amount = amount_handler(item_attrs[:amount])
        event_form(user, interval, amount, category.key).save
      end
    end
  end
end

User::Group.find_by!(name: "Initial User Group").then do |group|
  today = Time.current

  interval = Budget::Interval.for({ month: today.month, year: today.year - 1, user_group: group })

  while interval.year < today.year || (interval.year == today.year && interval.month <= today.month)
    create_budget(group.users.first, interval)
    interval = interval.next
  end
end
