require "rails_helper"

RSpec.describe Budget::Intervals::ItemSerializer do
  describe "#render" do
    subject do
      described_class.new(item: budget_item, maturity_interval: maturity_interval_double)
    end

    let(:user_group) { FactoryBot.create(:user_group, :with_user) }
    let(:interval) { FactoryBot.create(:budget_interval, user_group: user_group) }
    let(:icon) { FactoryBot.create(:icon) }
    let(:transaction_entry) do
      FactoryBot.create(
        :transaction_entry,
        account: FactoryBot.create(:account, user_group: user_group),
        details_attributes: [
          {
            key: SecureRandom.hex(6),
            amount: rand(-100_00..100_00),
            budget_item_id: budget_item.id,
          },
        ],
      )
    end
    let(:transaction_detail) { transaction_entry.details.take }
    let(:detail_serializer) do
      instance_double(Budget::Intervals::TransactionDetailSerializer, render: {})
    end
    let(:event_serializer) { instance_double(Budget::Items::EventSerializer, render: {}) }

    before do
      FactoryBot.create(:budget_item_event, :create_event, item_id: budget_item.id).then do |event|
        allow(Budget::Items::EventSerializer)
          .to receive(:new)
          .with(event)
          .and_return(event_serializer)
      end
      allow(Budget::Intervals::TransactionDetailSerializer)
        .to receive(:new)
        .with(transaction_detail)
        .and_return(detail_serializer)
    end

    context "when a non-accrual" do
      let(:category) { FactoryBot.create(:category, icon: icon, user_group: user_group) }
      let(:maturity_interval_double) do
        instance_double(Budget::UpcomingMaturityIntervalQuery::NullSerializer, month: nil, year: nil)
      end
      let(:budget_item) do
        FactoryBot.create(:budget_item,
                          interval: interval,
                          category: category,
                          user_group: user_group).as_presenter
      end

      # rubocop:disable RSpec/ExampleLength
      it "returns a hash of attributes" do
        expect(event_serializer).to receive(:render).once
        expect(detail_serializer).to receive(:render).once
        rendered = subject.render
        expect(rendered).to include(
          "amount" => budget_item.events.map(&:amount).sum,
          "budgetCategoryKey" => category.key,
          "difference" => budget_item.difference,
          "iconClassName" => icon.class_name,
          "key" => budget_item.key,
          "name" => category.name,
          "remaining" => budget_item.remaining,
        )
        expect(rendered).not_to have_key("maturityMonth")
        expect(rendered).not_to have_key("maturityYear")
      end
      # rubocop:enable RSpec/ExampleLength
    end

    context "when an accrual" do
      let(:category) { FactoryBot.create(:category, :accrual, icon: icon, user_group: user_group) }
      let(:month) { rand(1..12) }
      let(:year) { rand(2020..2049) }
      let(:maturity_interval_double) do
        instance_double(
          Budget::UpcomingMaturityIntervalQuery::UpcomingMaturityIntervalSerializer,
          month: month,
          year: year
        )
      end
      let(:budget_item) do
        FactoryBot.create(:budget_item,
                          interval: interval,
                          category: category,
                          user_group: user_group).as_presenter
      end

      # rubocop:disable RSpec/ExampleLength
      it "returns a hash of attributes" do
        expect(event_serializer).to receive(:render).once
        expect(detail_serializer).to receive(:render).once
        expect(subject.render).to include(
          "amount" => budget_item.events.map(&:amount).sum,
          "budgetCategoryKey" => category.key,
          "difference" => budget_item.difference,
          "iconClassName" => icon.class_name,
          "key" => budget_item.key,
          "maturityMonth" => month,
          "maturityYear" => year,
          "name" => category.name,
          "remaining" => budget_item.remaining,
        )
      end
      # rubocop:enable RSpec/ExampleLength
    end
  end
end
