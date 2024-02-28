module Budget
  module Items
    class EventSerializer < ApplicationSerializer
      attributes :key,
                 :amount,
                 :data
      attribute :created_at, on_render: proc { |datestring| datestring.strftime("%FT%TZ") }
      attribute :type_name, on_render: proc { |name| name.titleize }
    end
  end
end
