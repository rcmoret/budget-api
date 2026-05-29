require "rails_helper"

RSpec.describe WebApp::Budget::Categories::IndexSerializer do
  describe "#render" do
    subject(:serializer) do
      presenter = Budget::Categories::CollectionPresenter.new(user)
      described_class.new(presenter, params: { timezone: })
    end

    before do
      category
      create(:category, user_group: other_user.group)
    end

    let(:user) { create(:user) }
    let(:category) { create(:category, icon:, user_group: user.group) }
    let(:other_user) { create(:user) }
    let(:timezone) { user.configuration(:timezone) }
    let(:icon) { create(:icon) }

    it "returns serialized data" do
      data = serializer.to_h
      expect(data["categories"].size).to be 1
      category_data = data.dig("categories", 0)
      expect(category_data["key"]).to eq category.key
      expect(category_data).to eq(
        "key" => category.key,
        "slug" => category.slug,
        "name" => category.name,
        "defaultAmount" => category.default_amount,
        "isPerDiemEnabled" => category.is_per_diem_enabled,
        "isMonthly" => category.monthly?,
        "isExpense" => category.expense?,
        "archivedAt" => nil,
        "isArchived" => false,
        "isAccrual" => category.accrual?,
        "iconClassName" => icon.class_name,
        "iconKey" => icon.key,
        "createdAt" =>
          category
            .created_at
            .in_time_zone(timezone)
            .strftime("%B %-d, %Y %Z")
      )
    end
  end
end
