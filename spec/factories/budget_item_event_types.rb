FactoryBot.define do
  factory :budget_item_event_type, class: "Budget::ItemEventType" do
    name { Budget::EventTypes::VALID_EVENT_TYPES.sample }

    Budget::EventTypes::VALID_EVENT_TYPES.each do |event_type|
      trait event_type.to_sym do
        name { event_type }
      end
    end
  end
end
