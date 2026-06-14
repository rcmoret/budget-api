module Transaction
  module Scopes
    module Accounts
      extend ActiveSupport::Concern
      included do
        belongs_to :account

        scope :cash_flow, -> { joins(:account).merge(Account.cash_flow) }
        scope :non_cash_flow, lambda {
          joins(:account).merge(Account.non_cash_flow)
        }
      end
    end

    module ClearanceDate
      extend ActiveSupport::Concern

      included do
        scope :cleared, -> { where.not(clearance_date: nil) }
        scope :pending, -> { where(clearance_date: nil) }
        scope :prior_to, lambda { |date, include_pending: false|
          base_scope = cleared.where(arel_table[:clearance_date].lt(date))
          include_pending ? base_scope.or(pending) : base_scope
        }
        scope :on_or_prior_to, lambda { |date, include_pending: false|
          base_scope = cleared.where(arel_table[:clearance_date].lteq(date))
          include_pending ? base_scope.or(pending) : base_scope
        }
        scope :in, ->(range) { where(clearance_date: range) }
        scope :between, lambda { |range, include_pending: false|
          include_pending ? self.in(range).or(pending) : self.in(range)
        }
      end
    end
  end
end
