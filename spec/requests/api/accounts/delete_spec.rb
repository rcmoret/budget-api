require "rails_helper"

RSpec.describe "DELETE /api/account/:key", type: :request do
  subject { delete(api_account_path(key), headers: headers) }

  context "when passing a valid token" do
    let(:user) { FactoryBot.create(:user) }

    include_context "with valid token"

    context "when deleting an account with existing transaction entries" do
      let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
      let(:key) { account.key }

      before do
        FactoryBot.create_list(:transaction_entry, 2, account: account)
      end

      it "archives the account" do
        freeze_time do
          expect { subject }
            .to change { account.reload.archived_at }
            .from(nil)
            .to(Time.current)

          expect(response).to have_http_status(:accepted)
        end
      end
    end

    context "when deleting an account with no existing transaction entries" do
      before do
        FactoryBot.create(:account, user_group: user.user_group, key: key)
      end

      let(:key) { SecureRandom.hex(6) }

      it "deletes the account" do
        expect { subject }
          .to change { Account.belonging_to(user).count }
          .by(-1)
      end
    end

    context "when the deletion does not process successfully" do
      let(:key) { SecureRandom.hex(6) }
      let(:account_double) { instance_double(Account, destroy: nil, errors: errors_double, archived_at: nil) }
      let(:errors_double) do
        instance_double(ActiveModel::Errors, any?: true, to_hash: { account: "could not be saved" })
      end

      before do
        allow(Account).to receive(:fetch).and_return(account_double)
        subject
      end

      it "returns the errors and an unprocessable entity status" do
        expect(response).to have_http_status :unprocessable_entity
        expect(JSON.parse(response.body)).to eq errors_double.to_hash.stringify_keys
      end
    end
  end
end
