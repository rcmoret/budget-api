CATEGORIES = {
  "mortgage" => [
    { amount: -900_00 },
    { amount: -900_00 },
  ],
  "cell-phone" => {
    amount: -> { (200..230).to_a.sample * -100 },
  },
  "salary" => [
    { amount: 250_000 },
  ],
  "groceries" => {
    amount: -> { (600..700).to_a.sample * -100 },
  },
  "gas" => {
    amount: -> { (90..110).to_a.sample * -100 },
  },
  "misc-income" => {
    amount: -> { (100..150).to_a.sample * 100 },
  },
  "car-ins" => {
    amount: -80_00,
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

# rubocop:disable Metrics/MethodLength
def event_form(user, interval, amount, category_key)
  Forms::Budget::EventsForm.new(
    user,
    events: [{
      amount: amount,
      month: interval.month,
      year: interval.year,
      budget_category_key: category_key,
      budget_item_key: SecureRandom.hex(6),
      event_type: Budget::EventTypes::ITEM_CREATE,
    }]
  )
end
# rubocop:enable Metrics/MethodLength

def create_budget(user, interval)
  CATEGORIES.each_pair do |slug, attributes|
    Budget::Category.by_slug(slug).then do |category|
      Array.wrap(attributes).each do |item_attrs|
        amount = amount_handler(item_attrs[:amount])
        form = event_form(user, interval, amount, category.key)
        form.save.then { |result| binding.pry if result != true }
      end
    end
  end
end

Budget::ItemEvent.create_events.find_each do |ev|
  ev.update(created_at: 1.month.ago)
end

User::Group.find_by!(name: "Initial User Group").then do |group|
  today = Time.current

  interval = Budget::Interval.for({ month: today.month, year: today.year, user_group: group })

  interval.update(start_date: today.beginning_of_month, end_date: today.end_of_month, set_up_completed_at: Time.current)

  create_budget(group.users.first, interval)
end
