module Budget
  module Intervals
    class EventSerializer < ApplicationSerializer
      attributes :key,
                 :amount,
                 :data,
                 :type_name
      attribute :created_at, on_render: proc { |datestring| datestring.strftime("%FT%TZ") }
    end
  end
end
