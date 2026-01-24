require "rails_helper"

RSpec.describe "DELETE /api/account/:key" do
  subject { delete(api_account_path(account_key), headers: headers) }

  context "when passing a valid token" do
    let(:user) { create(:user) }

    include_context "with valid token"

    context "when the account is not found" do
      let(:account_key) { KeyGenerator.call }

      include_examples "endpoint requires account"
    end

    context "when passing the key for an unrelated account" do
      include_context "with an account belonging to a different user group"
      let(:account_key) { other_groups_account.key }

      include_examples "endpoint requires account"
    end

    context "when deleting an account with existing transaction entries" do
      let(:account) { create(:account, user_group: user.user_group) }
      let(:account_key) { account.key }

      before do
        create_list(:transaction_entry, 2, account: account)
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
        create(:account, user_group: user.user_group, key: account_key)
      end

      let(:account_key) { KeyGenerator.call }

      it "deletes the account" do
        expect { subject }
          .to change { Account.belonging_to(user).count }
          .by(-1)
      end
    end

    context "when the deletion does not process successfully" do
      let(:account_key) { KeyGenerator.call }
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
        expect(response.parsed_body).to eq errors_double.to_hash.stringify_keys
      end
    end
  end
end
