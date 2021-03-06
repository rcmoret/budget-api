# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Budget::ItemView, type: :model do
  it { should be_readonly }

  around { |ex| travel_to(Time.current.beginning_of_minute) { ex.run } }
  describe '.to_hash' do
    before { FactoryBot.create(:budget_item_event, :item_create, item: item, amount: amount) }
    let(:budget_interval) { FactoryBot.create(:budget_interval, :current) }
    let(:item) { FactoryBot.create(:weekly_item, interval: budget_interval) }
    let(:category) { item.category }
    let(:spent) { 0 }
    let(:amount) { category.expense? ? (-1 * rand(1000)) : rand(1000) }
    let(:deletable?) { true }
    let(:expected_hash) do
      {
        id: item.id,
        name: category.name,
        amount: amount,
        accrual: category.accrual,
        spent: spent,
        budget_category_id: category.id,
        monthly: false,
        icon_class_name: category.icon_class_name,
        month: budget_interval.month,
        year: budget_interval.year,
        budget_interval_id: budget_interval.id,
        expense: category.expense?,
        transaction_count: 0,
        maturity_month: nil,
        maturity_year: nil,
        deleted_at: nil,
      }
    end

    subject { described_class.find(item.id).to_hash }

    it { expect(subject).to eq expected_hash }
  end
end
