# frozen_string_literal: true

module WebApp
  module Mixins
    module PageMetadata
      extend ActiveSupport::Concern

      included do
        include Alba::Resource

        nested_attribute :metadata do
          attribute(:namespace) do
            current_path = params[:current_path]
            if current_path.starts_with?(%r{/budget|/dashboard})
              :budget
            elsif current_path.starts_with?("/account")
              :accounts
            else
              ""
            end
          end
          attribute(:user_key) { Current.user_profile&.key }
          attribute(:page_name) { params[:page_name].to_s }

          transform_keys :lower_camel
        end
      end
    end
  end
end
