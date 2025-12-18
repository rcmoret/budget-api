module User
  class Group < ApplicationRecord
    include HasKeyIdentifier

    has_many :users,
             foreign_key: :user_group_id,
             class_name: "Profile",
             inverse_of: :user_group,
             dependent: :restrict_with_exception
    has_many :accounts,
             class_name: "Account",
             dependent: :restrict_with_exception,
             foreign_key: :user_group_id,
             inverse_of: :user_group
    has_many :budget_categories,
             class_name: "Budget::Category",
             foreign_key: :user_group_id,
             inverse_of: :user_group,
             dependent: :restrict_with_exception
    has_many :budget_intervals,
             class_name: "Budget::Interval",
             foreign_key: :user_group_id,
             inverse_of: :user_group,
             dependent: :restrict_with_exception
  end
end
