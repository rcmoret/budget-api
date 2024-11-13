module API
  module Budget
    module Interval
      class DataSerializer < ApplicationSerializer
        include Mixins::SharedInterval

        attributes :month, :year, :days_remaining, :total_days
        attribute :first_date, on_render: proc { |datestring| datestring.strftime("%F") }
        attribute :last_date, on_render: proc { |datestring| datestring.strftime("%F") }
        attribute :is_closed_out, alias_of: :closed_out?
        attribute :is_current, alias_of: :current?
        attribute :is_set_up, alias_of: :set_up?
      end
    end
  end
end
