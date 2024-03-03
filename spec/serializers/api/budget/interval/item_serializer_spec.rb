require "rails_helper"

RSpec.describe API::Budget::Interval::ItemSerializer do
  describe "#render" do
    subject do
      described_class.new(item: budget_item, maturity_interval: maturity_interval_double)
    end

    let(:user_group) { create(:user_group, :with_user) }
    let(:interval) { create(:budget_interval, user_group: user_group) }
    let(:icon) { create(:icon) }
    let(:transaction_entry) do
      create(
        :transaction_entry,
        account: create(:account, user_group: user_group),
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

    context "when a non-accrual" do
      let(:category) { create(:category, icon: icon, user_group: user_group) }
      let(:maturity_interval_double) do
        instance_double(Budget::UpcomingMaturityIntervalQuery::NullSerializer, month: nil, year: nil)
      end
      let(:budget_item) do
        create(:budget_item,
               interval: interval,
               category: category).decorated
      end

      # rubocop:disable RSpec/ExampleLength
      it "returns a hash of attributes" do
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
      let(:category) { create(:category, :accrual, icon: icon, user_group: user_group) }
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
        create(:budget_item,
               interval: interval,
               category: category).decorated
      end

      # rubocop:disable RSpec/ExampleLength
      it "returns a hash of attributes" do
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
