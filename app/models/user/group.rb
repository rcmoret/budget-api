module User
  class Group < ApplicationRecord
    include HasKeyIdentifier

    has_many :users,
             foreign_key: :user_group_id,
             class_name: "Account",
             inverse_of: :user_group,
             dependent: :restrict_with_exception
    has_many :accounts, class_name: "::Account", dependent: :restrict_with_exception
    has_many :budget_categories, dependent: :restrict_with_exception
    has_many :budget_intervals, dependent: :restrict_with_exception
  end
end
