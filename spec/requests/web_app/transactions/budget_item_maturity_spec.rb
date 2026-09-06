require "rails_helper"

RSpec.describe "WebApp::Mixins::UsesTransactionEntryForm budget maturity" do
  let(:user) { create(:user) }
  let(:user_group) { user.group }
  let(:account) { create(:account, user_group:) }
  let(:accrual_category) { create(:category, :accrual, user_group:) }
  let(:item_interval) { create(:budget_interval, user_group:) }
  let(:accrual_item) do
    create(:budget_item, interval: item_interval, category: accrual_category)
  end

  before { sign_in(user) }

  def maturity_intervals_for(category)
    Budget::CategoryMaturityInterval.where(category:)
  end

  describe "creating a transaction" do
    subject(:post_transaction) do
      post "/account/#{account.slug}/transaction", params: {
        transaction: {
          key: KeyGenerator.call,
          details_attributes: [
            { key: KeyGenerator.call, amount: 50_00,
              budget_item_key: accrual_item.key, },
          ],
        },
        redirect: { segments: [] },
      }
    end

    context "when the accrual item has no maturity interval scheduled" do
      it "creates a maturity interval for the item's own interval" do
        expect { post_transaction }
          .to change { maturity_intervals_for(accrual_category).count }
          .from(0).to(1)

        expect(maturity_intervals_for(accrual_category).first.interval)
          .to eq(item_interval)
      end
    end

    context "when a maturity interval already matches the item's interval" do
      before do
        create(:maturity_interval, category: accrual_category,
          interval: item_interval)
      end

      it "does not create an additional maturity interval" do
        expect { post_transaction }
          .not_to(change { maturity_intervals_for(accrual_category).count })
      end
    end

    context "when a maturity interval is scheduled for a later interval" do
      let(:later_interval) { item_interval.next }

      before do
        create(:maturity_interval, category: accrual_category,
          interval: later_interval)
      end

      it "still creates a maturity interval for the item's earlier interval" do
        expect { post_transaction }
          .to change { maturity_intervals_for(accrual_category).count }
          .from(1).to(2)

        expect(maturity_intervals_for(accrual_category).map(&:interval))
          .to contain_exactly(later_interval, item_interval)
      end
    end

    context "when the budget item's category is not an accrual" do
      subject(:post_transaction) do
        post "/account/#{account.slug}/transaction", params: {
          transaction: {
            key: KeyGenerator.call,
            details_attributes: [
              { key: KeyGenerator.call, amount: 50_00,
                budget_item_key: non_accrual_item.key, },
            ],
          },
          redirect: { segments: [] },
        }
      end

      let(:non_accrual_category) { create(:category, user_group:) }
      let(:non_accrual_item) do
        create(:budget_item, interval: item_interval,
          category: non_accrual_category)
      end

      it "does not create a maturity interval" do
        expect { post_transaction }
          .not_to(change { Budget::CategoryMaturityInterval.count })
      end
    end

    context "when the detail has no budget item" do
      subject(:post_transaction) do
        post "/account/#{account.slug}/transaction", params: {
          transaction: {
            key: KeyGenerator.call,
            details_attributes: [
              { key: KeyGenerator.call, amount: 50_00 },
            ],
          },
          redirect: { segments: [] },
        }
      end

      it "does not create a maturity interval" do
        expect { post_transaction }
          .not_to(change { Budget::CategoryMaturityInterval.count })
      end
    end

    context "when the transaction fails to save" do
      subject(:post_transaction) do
        post "/account/#{account.slug}/transaction", params: {
          transaction: { key: KeyGenerator.call, details_attributes: [] },
          redirect: { segments: [] },
        }
      end

      it "does not create a maturity interval" do
        expect { post_transaction }
          .not_to(change { Budget::CategoryMaturityInterval.count })
      end
    end

    context "when two details reference unmatured items in the same " \
            "accrual category and interval" do
      subject(:post_transaction) do
        post "/account/#{account.slug}/transaction", params: {
          transaction: {
            key: KeyGenerator.call,
            details_attributes: [
              { key: KeyGenerator.call, amount: 50_00,
                budget_item_key: accrual_item.key, },
              { key: KeyGenerator.call, amount: 25_00,
                budget_item_key: other_accrual_item.key, },
            ],
          },
          redirect: { segments: [] },
        }
      end

      let(:other_accrual_item) do
        create(:budget_item, interval: item_interval,
          category: accrual_category)
      end

      it "only creates a single maturity interval for that category/interval" do
        expect { post_transaction }
          .to change { maturity_intervals_for(accrual_category).count }
          .from(0).to(1)
      end
    end
  end

  describe "updating a transaction" do
    context "when the entry already has an unmatured accrual detail" do
      subject(:put_transaction) do
        put "/account/#{account.slug}/transaction/#{entry.key}", params: {
          transaction: { key: entry.key, description: "Updated" },
          redirect: { segments: [] },
        }
      end

      let(:entry) do
        create(:transaction_entry, account:,
          details_attributes: [
            { key: KeyGenerator.call, amount: 10_00,
              budget_item_id: accrual_item.id, },
          ])
      end

      it "creates a maturity interval for that item's interval" do
        expect { put_transaction }
          .to change { maturity_intervals_for(accrual_category).count }
          .from(0).to(1)
      end
    end

    context "when adding a new unmatured accrual detail" do
      subject(:put_transaction) do
        put "/account/#{account.slug}/transaction/#{entry.key}", params: {
          transaction: {
            key: entry.key,
            details_attributes: [
              { key: KeyGenerator.call, amount: 15_00,
                budget_item_key: accrual_item.key, },
            ],
          },
          redirect: { segments: [] },
        }
      end

      let(:entry) { create(:transaction_entry, account:) }

      it "creates a maturity interval" do
        expect { put_transaction }
          .to change { maturity_intervals_for(accrual_category).count }
          .from(0).to(1)
      end
    end
  end
end
