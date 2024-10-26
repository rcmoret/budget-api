module API
  module Budget
    module Items
      class EventSerializer < ApplicationSerializer
        attributes :key,
                   :amount,
                   :data
        attribute :created_at, on_render: proc { |datestring| datestring.strftime("%FT%TZ") }
        attribute :comparison_date,
                  alias_of: :created_at,
                  on_render: proc { |datestring| datestring.strftime("%FT%TZ") }
        attribute :type_name, on_render: :titleize
      end
    end
  end
end
