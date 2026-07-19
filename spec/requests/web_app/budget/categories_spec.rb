require "rails_helper"

RSpec.describe "WebApp::Budget::Categories::IndexController", :inertia do
  subject(:get_categories) { get "/budget/categories" }

  let(:user) { create(:user) }
  let(:user_group) { user.group }

  let!(:category) do
    create(:category, :monthly, :expense, :with_icon, user_group:)
  end

  around do |example|
    travel_to(Time.zone.local(2026, 7, 15, 12, 0, 0)) { example.run }
  end

  before { sign_in(user) }

  it "renders the categories component" do
    get_categories

    expect(response).to have_http_status(:ok)
    expect_inertia.to render_component("budget/categories")
  end

  describe "categories" do
    subject(:categories) do
      get_categories
      inertia.props[:categories]
    end

    it "serializes a category with its full attribute set" do
      expect(categories).to eq [
        {
          key: category.key,
          archivedAt: nil,
          defaultAmount: category.default_amount,
          iconClassName: category.icon.class_name,
          iconKey: category.icon.key,
          isPerDiemEnabled: false,
          name: category.name,
          objectKey: "budget-category-#{category.key}",
          slug: category.slug,
          isMonthly: true,
          isExpense: true,
          isArchived: false,
          isAccrual: false,
          createdAt: "July 15, 2026 UTC",
        },
      ]
    end

    it "orders categories by name" do
      zed = create(:category, name: "Zebra", user_group:)
      abe = create(:category, name: "Apple", user_group:)

      expect(categories.pluck(:name))
        .to eq [ "Apple", category.name, "Zebra" ]
      expect(categories.pluck(:key))
        .to eq [ abe.key, category.key, zed.key ]
    end

    it "only includes the current user's categories" do
      create(:category, user_group: create(:user).group)

      expect(categories.pluck(:key)).to eq [ category.key ]
    end

    it "formats the archived timestamp for an archived category" do
      category.update!(archived_at: Time.zone.local(2026, 6, 3, 9, 0, 0))

      serialized = categories.find { |c| c[:key] == category.key }
      expect(serialized[:isArchived]).to be true
      expect(serialized[:archivedAt]).to eq "June 3, 2026 UTC"
    end
  end

  describe "pageData" do
    subject(:page_data) do
      get_categories
      inertia.props[:pageData]
    end

    it "serializes the page metadata" do
      expect(page_data[:metadata]).to eq(
        namespace: :budget,
        userKey: user.key,
        pageName: "budget/categories"
      )
    end

    it "reports the static route segments" do
      expect(page_data[:redirectSegments]).to eq %i[budget categories]
    end
  end
end
