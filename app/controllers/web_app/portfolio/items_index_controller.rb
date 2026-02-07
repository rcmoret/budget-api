# frozen_string_literal: true

module WebApp
  module Portfolio
    class ItemsIndexController < BaseController
      skip_before_action :authenticate_user_profile!
      skip_before_action :set_current_user!

      def call
        render inertia: "portfolio/index", props: page_props
      end

      private

      def portfolio_email
        @portfolio_email ||= params.permit(:email)[:email]
      end

      def props
        {
          about: portfolio_profile.about || "",
          allow_edit: current_user_profile&.email == portfolio_email,
          portfolio_items: portfolio_items,
          email: portfolio_email,
        }
      end

      def portfolio_profile
        @portfolio_profile ||=
          User::Profile.find_by(email: portfolio_email)
      end

      def namespace = "portfolio"

      def portfolio_items
        portfolio_profile.portfolio_items.map do |item|
          {
            key: item.key,
            title: item.title,
            description: item.description,
            image_url: item.image.attached? ? Rails.application.routes.url_helpers.rails_blob_path(item.image, only_path: true) : nil,
            content_type: item.image.attached? ? item.image.content_type : nil,
          }
        end
      end
    end
  end
end
