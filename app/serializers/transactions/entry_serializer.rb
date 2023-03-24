module Transactions
  class EntrySerializer < ApplicationSerializer
    attributes :key,
               :amount,
               :check_number,
               :clearance_date,
               :description,
               :notes
    attribute :transfer_key, conditional: :transfer?
    attribute :is_budget_exclusion, alias_of: :budget_exclusion?
    attribute :details, each_serializer: DetailSerializer
    attribute :updated_at, on_render: proc { |datetime| datetime.strftime("%FT%TZ") }

    delegate :key, to: :transfer, prefix: true

    def amount
      details.pluck(:amount).sum
    end
  end
end
