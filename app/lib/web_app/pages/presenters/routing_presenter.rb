# frozen_string_literal: true

module WebApp
  module Pages
    module Presenters
      class RoutingPresenter
        include Rails.application.routes.url_helpers

        def initialize(params)
          @params = params
        end

        def account_menu_route
          params[:prev_selected_account_path].presence ||
            manage_accounts_route
        end

        def budget_dashboard_route
          return "#" if budget_dashboard_path == current_route

          budget_dashboard_path
        end

        def create_budget_events_route
          budget_create_events_path
        end

        def current_route = params[:current_path]

        def manage_accounts_route
          return "#" if accounts_path == current_route

          accounts_path
        end

        def manage_budget_categories_route = budget_categories_path

        def user_sign_out_route = user_sign_out_path

        attr_reader :params
      end
    end
  end
end
