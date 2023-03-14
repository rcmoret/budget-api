module User
  class EventForm
    def initialize(event_type:, actor:, target_user: nil, event_data: {}, transient_data: {})
      @actor = actor
      @target_user = target_user || actor
      @transient_data = transient_data
      @event_type = EventType.for(event_type)
      @event_data = event_data.merge(transient_data.transform_values { "[FILTERED]" })
    end

    def call
      return event_type.subscriber.new(event, transient_data).call if event.save

      raise StandardError
    end

    private

    def event
      Event.new(
        actor: actor,
        target_user: target_user,
        key: SecureRandom.hex(6),
        data: event_data,
      )
    end

    attr_reader :actor, :target_user, :event_data, :transient_data, :event_type
  end
end
