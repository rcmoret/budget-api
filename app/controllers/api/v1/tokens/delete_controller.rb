module API
  module V1
    module Tokens
      class DeleteController < BaseController
        def call
          User::EventForm.new(
            actor: current_api_user,
            event_type: :expire_current_token,
            event_data: { token_key: current_token_context.key },
          ).call

          head :no_content
        end
      end
    end
  end
end
