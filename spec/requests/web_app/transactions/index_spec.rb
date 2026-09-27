require "rails_helper"

RSpec.describe "WebApp::Transactions::IndexController", :inertia do
  subject(:get_transactions) { get path }

  include_context "when there is a current interval and item"

  let(:user) { create(:user) }
  let(:account) { create(:account, user_group: user.group) }

  before { sign_in(user) }

  describe "the index route" do
    let(:path) { "/account/#{account.slug}/transactions" }

    it "renders the transactions component" do
      get_transactions

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component("transactions")
    end
  end

  # The client opens the "Add Transaction" form off the trailing `/new`; the
  # server just renders the same page.
  describe "the new transaction route" do
    context "without a month and year" do
      let(:path) { "/account/#{account.slug}/transactions/new" }

      it "renders the transactions component" do
        get_transactions

        expect(response).to have_http_status(:ok)
        expect_inertia.to render_component("transactions")
      end
    end

    context "with a month and year" do
      let(:path) do
        "/account/#{account.slug}/transactions/" \
          "#{interval.month}/#{interval.year}/new"
      end

      it "renders the transactions component for that month" do
        get_transactions

        expect(response).to have_http_status(:ok)
        expect_inertia.to render_component("transactions")
      end
    end
  end
end
