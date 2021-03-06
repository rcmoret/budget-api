# frozen_string_literal: true

class DiscretionaryTransactions
  attr_reader :budget_interval

  def self.for(budget_interval = Budget::Interval.current)
    new(budget_interval)
  end

  def initialize(budget_interval)
    @budget_interval = budget_interval
  end

  delegate :current?, :date_hash, :date_range, :days_remaining, :total_days,
           to: :budget_interval

  def collection
    @collection ||=
      Transaction::DetailView
      .discretionary
      .budget_inclusions
      .non_transfers
      .between(date_range, include_pending: current?)
  end

  def total
    collection.total.to_i
  end
end
