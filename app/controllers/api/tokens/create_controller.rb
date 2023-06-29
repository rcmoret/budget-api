module API
  module Tokens
    class CreateController < BaseController
      skip_before_action :authenticate_token!
      before_action :user_lookup!

      def call
        case event.call
        in [:ok, token_payload]
          render json: token_payload, status: :created
        in [:error, errors]
          render json: errors, status: :unauthorized
        end
      end

      private

      def event
        User::EventForm.new(
          actor: user,
          event_type: :user_auth_token_requested,
          event_data: { ip_address: request.ip },
          transient_data: { password: user_params[:password] },
        )
      end

      def user
        @user ||= User::Profile.find_by(email: user_params[:email])
      end

      def user_params
        params.require(:user).permit(:email, :password)
      end

      def user_lookup!
        return if user.present?

        render json: { email: ["user profile not found by email: #{user_params[:email]}"] },
               status: :not_found
      end
    end
  end
end
