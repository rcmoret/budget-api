# frozen_string_literal: true

module WebApp
  module Serializers
    module Mixins
      module PageMetadata
        extend ActiveSupport::Concern

        included do
          nested_attribute :metadata do
            attribute(:namespace) do |presenter|
              current_path = presenter.current_path
              if current_path.starts_with?(%r{/budget|/dashboard})
                :budget
              elsif current_path.starts_with?("/account")
                :accounts
              elsif current_path.starts_with?("/profile")
                "profile"
              else
                ""
              end
            end
            attribute(:user_key) { Current.profile_key }
            attribute(:page_name) { |presenter| presenter.page_name.to_s }
          end
        end
      end
    end
  end
end
