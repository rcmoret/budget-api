# frozen_string_literal: true

module WebApp
  module Pages
    module Presenters
      class ApplicationPresenter
        PageData = Data.define(
          :current_path,
          :flash,
          :page_name,
          :prev_selected_account_path,
          :redirect_segments,
          :theme_preference
        )

        EMPTY_PAGE = PageData.new(
          current_path: "",
          flash: {},
          page_name: "",
          prev_selected_account_path: nil,
          redirect_segments: [],
          theme_preference: "system"
        )

        def self.with(
          current_path: "",
          flash: {},
          page_name: "",
          prev_selected_account_path: nil,
          redirect_segments: [],
          theme_preference: "system"
        )
          data = PageData.new(
            current_path:,
            flash:,
            page_name:,
            prev_selected_account_path:,
            redirect_segments:,
            theme_preference:
          )
          new(data)
        end

        def initialize(page_data = EMPTY_PAGE)
          @page_data = page_data
        end

        def app_routes
          RoutingPresenter.new(
            current_path:,
            prev_selected_account_path:
          )
        end

        def flash
          @flash ||= {
            alerts: Array.wrap(page_data.flash[:alert]),
            info: Array.wrap(page_data.flash[:info]),
            notices: Array.wrap(page_data.flash[:notice]),
            warnings: Array.wrap(page_data.flash[:warning]),
          }
        end

        attr_reader :page_data

        delegate :current_path,
          :page_name,
          :prev_selected_account_path,
          :redirect_segments,
          :theme_preference,
          to: :page_data
      end
    end
  end
end
