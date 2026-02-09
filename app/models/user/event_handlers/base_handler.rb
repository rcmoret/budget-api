module User
  module EventHandlers
    class BaseHandler
      include CubanLinx::CallChain

      def initialize(event, transient_data = {})
        @data = event
                .data
                .merge(transient_data.transform_values { "FILTERED" })
                .merge(
                  actor: event.actor,
                  target_user: event.target_user,
                  event_key: event.key
                )
        @transient_data = transient_data
      end

      private

      attr_reader :data, :transient_data

      def ok_tuple(**args)
        [ :ok, args ]
      end
    end
  end
end
