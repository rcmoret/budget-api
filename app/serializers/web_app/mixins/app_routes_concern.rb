# frozen_string_literal: true

module WebApp
  module Mixins
    module AppRoutesConcern
      extend ActiveSupport::Concern

      included do
        include Alba::Resource

        attribute :app_routes do
          Alba.hashify(Presenters::WebApp::RoutingPresenter.new(params)) do
            attributes :account_menu_route,
              :budget_dashboard_route,
              :create_budget_events_route,
              :current_route,
              :manage_accounts_route,
              :manage_budget_categories_route,
              :user_sign_out_route

            transform_keys :lower_camel
          end
        end
      end
    end
  end
end
