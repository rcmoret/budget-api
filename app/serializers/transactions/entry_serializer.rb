module Transactions
  class EntrySerializer < ApplicationSerializer
    attributes :key,
               :amount,
               :check_number,
               :clearance_date,
               :description,
               :notes,
               :updated_at
    attribute :transfer_key, conditional: :transfer?
    attribute :is_budget_exclusion, alias_of: :budget_exclusion?
    attribute :details, each_serializer: DetailSerializer

    delegate :key, to: :transfer, prefix: true

    def amount
      details.pluck(:amount).sum
    end
  end
end
