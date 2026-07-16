# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module AppRoutesConcern
        extend ActiveSupport::Concern

        AppRoutesResource = Class.new(GenericSerializer) do
          attributes :account_menu_route,
            :budget_dashboard_route,
            :create_budget_events_route,
            :current_route,
            :manage_accounts_route,
            :manage_budget_categories_route,
            :user_profile_route,
            :user_sign_out_route
        end

        included do
          one :app_routes, resource: AppRoutesResource
        end
      end
    end
  end
end
