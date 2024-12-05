# frozen_string_literal: true

module BelongsToUserGroup
  extend ActiveSupport::Concern

  included do
    belongs_to :user_group, class_name: "User::Group"

    scope :belonging_to, lambda { |user_or_group|
      case user_or_group
      in User::Profile => user
        joins(:user_group).where(user_group: user.group)
      in User::Group => group
        joins(:user_group).where(user_group: group)
      end
    }
  end
end
