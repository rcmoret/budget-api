# frozen_string_literal: true

module Presenters
  class ControllerMetadata
    def initialize(
      namespace:,
      prev_selected_account_path:,
      current_interval: nil,
      **options
    )
      @namespace = namespace
      @prev_selected_account_path = prev_selected_account_path
      @current_interval = current_interval
      @options = options
    end

    def user_key
      Current.user_profile.key
    end

    attr_reader :namespace,
      :prev_selected_account_path,
      :current_interval,
      :options
  end
end
