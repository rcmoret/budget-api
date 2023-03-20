class Icon < ApplicationRecord
  include HasKeyIdentifier

  validates :name, uniqueness: true, presence: true
  validates :class_name, uniqueness: true, presence: true

  has_many :budget_categories, class_name: "Budget::Category", dependent: :nullify
end
