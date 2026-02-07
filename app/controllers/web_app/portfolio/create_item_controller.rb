# frozen_string_literal: true

module WebApp
  module Portfolio
    class CreateItemController < BaseController
      def call
        item = current_user_profile.portfolio_items.create!(
          key: PortfolioItem.generate_key,
          title: portfolio_params[:title],
          description: portfolio_params[:description]
        )

        if portfolio_params[:image].present?
          item.image.attach(portfolio_params[:image])
        end

        redirect_to "/portfolio/items?email=#{current_user_profile.email}"
      end

      private

      def portfolio_params
        params.permit(:title, :description, :image)
      end
    end
  end
end
