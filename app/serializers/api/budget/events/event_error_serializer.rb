module API
  module Budget
    module Events
      class EventErrorSerializer < ApplicationSerializer
        attributes :key, :errors

        def initialize(key, errors)
          @key = key.to_s.split(".").last
          @errors = errors.reduce(&:merge)
          super(errors)
        end

        attr_reader :key, :errors
      end
    end
  end
end
