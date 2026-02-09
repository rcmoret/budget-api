module User
  class EventForm
    def initialize(
      event_type:,
      actor:,
      target_user: nil,
      event_data: {},
      transient_data: {}
    )
      @actor = actor
      @target_user = target_user || actor
      @transient_data = transient_data
      @event_type = EventType.for(event_type)
      @provided_event_data = event_data
    end

    def call
      return event_type.subscriber.new(event, transient_data).call if event.save

      raise StandardError
    end

    private

    def event
      Event.new(
        actor:,
        target_user:,
        event_type:,
        key: KeyGenerator.call,
        data: event_data,
      )
    end

    def event_data
      @event_data ||=
        provided_event_data
        .merge(transient_data.transform_values { "[FILTERED]" })
    end

    attr_reader :actor,
      :provided_event_data,
      :target_user,
      :transient_data,
      :event_type
  end
end
