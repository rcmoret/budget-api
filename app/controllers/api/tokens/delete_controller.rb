module API
  module Tokens
    class DeleteController < BaseController
      def call
        event.call
        render json: NullObjectSerializer.new.render, status: :accepted
      end

      private

      def event
        User::EventForm.new(
          actor: api_user,
          event_type: :expire_current_token,
          event_data: { token_key: current_token_context.key },
        )
      end
    end
  end
end
