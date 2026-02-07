# frozen_string_literal: true

module WebApp
  module Portfolio
    class UpdateAboutMeController < BaseController
      def call
        current_user_profile.update!(about: about_params[:about])

        redirect_to "/portfolio/items?email=#{current_user_profile.email}"
      end

      private

      def about_params
        params.permit(:about)
      end
    end
  end
end
