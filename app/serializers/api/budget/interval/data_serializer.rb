module API
  module Budget
    module Interval
      class DataSerializer < ApplicationSerializer
        include Mixins::SharedInterval

        attributes :month, :year, :days_remaining, :total_days
        attribute :first_date, on_render: proc { |timestamp| render_date_time(timestamp) }
        attribute :last_date, on_render: proc { |timestamp| render_date_time(timestamp) }
        attribute :is_closed_out, alias_of: :closed_out?
        attribute :is_current, alias_of: :current?
        attribute :is_set_up, alias_of: :set_up?
        attribute :discretionary, on_render: :render

        def discretionary
          API::Budget::Interval::DiscretionarySerializer.new(__getobj__)
        end
      end
    end
  end
end
