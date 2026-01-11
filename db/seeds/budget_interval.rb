def amount_handler(amount)
  case amount
  when Integer
    amount
  when Proc
    amount.call
  end
end

def event_form(user, interval, amount, category_key, budget_item_key: SecureRandom.hex(6))
  Forms::Budget::EventsForm.new(
    user,
    events: [{
      amount: amount,
      month: interval.month,
      year: interval.year,
      budget_category_key: category_key,
      budget_item_key: budget_item_key,
      event_type: Budget::EventTypes::ITEM_CREATE,
    }]
  )
end

# rubocop:disable Metrics/AbcSize
def create_budget(user, interval, description: :base)
  ITEM_AMOUNTS.each_pair do |category_slug, attributes|
    Budget::Category.by_slug(category_slug).then do |category|
      Array.wrap(attributes).each do |item_attrs|
        next if item_attrs[description.to_s].nil?

        amount = amount_handler(item_attrs[description.to_s])
        form = event_form(user, interval, amount, category.key,
                          **{ budget_item_key: item_attrs["key"] }.compact)
        form.save.then { |result| binding.pry if result != true }
      end
    end
  end
end
# rubocop:enable Metrics/AbcSize

Budget::ItemEvent.create_events.find_each do |ev|
  ev.update(created_at: 1.month.ago)
end

User::Group.find_by!(name: "Initial User Group").then do |group|
  today = Time.current

  base_interval = Budget::Interval.for({ month: today.month, year: today.year, user_group: group })

  base_interval.update(
    start_date: today.beginning_of_month,
    end_date: today.end_of_month,
    set_up_completed_at: Time.current
  )

  create_budget(group.users.first, base_interval)

  next_interval = base_interval.next
  create_budget(group.users.first, next_interval, description: :future)
end
