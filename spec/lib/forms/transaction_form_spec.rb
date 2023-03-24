require "rails_helper"

RSpec.describe Forms::TransactionForm do
  describe ".save" do
    context "when creating a new transaction" do
      let(:user) { FactoryBot.create(:user) }
      let(:account) { FactoryBot.create(:account, user_group: user.user_group) }
      let(:transaction_entry) { Transaction::Entry.new(account: account) }
      let(:params) do
        {
          budget_exclusion: budget_exclusion,
          check_number: nil,
          clearance_date: Time.current.to_date,
          key: SecureRandom.hex(6),
          notes: nil,
          receipt: nil,
          details_attributes: details_attributes,
        }
      end
      let(:budget_exclusion) { false }

      context "when passing valid params" do
        let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.user_group) }
        let(:details_attributes) do
          [
            {
              key: SecureRandom.hex(6),
              amount: 100_00,
              budget_item_id: budget_item.id,
            },
          ]
        end

        it "creates a transaction entry" do
          expect { described_class.new(user, transaction_entry, params).save }
            .to change { Transaction::Entry.count }
            .by(+1)
        end

        it "returns true" do
          subject = described_class.new(user, transaction_entry, params)

          expect(subject.save).to be true
        end

        context "when creating a single detail" do
          it "creates a single transaction detail" do
            expect { described_class.new(user, transaction_entry, params).save }
              .to change { Transaction::Detail.where(budget_item: budget_item).count }
              .by(+1)
          end
        end

        context "when creating multiple details" do
          let(:additional_budget_item) { FactoryBot.create(:budget_item, user_group: user.user_group) }
          let(:details_attributes) do
            [
              { key: SecureRandom.hex(6), amount: 100_00, budget_item_id: additional_budget_item.id },
              { key: SecureRandom.hex(6), amount: 100_00, budget_item_id: budget_item.id },
            ]
          end

          it "creates the correct number of transaction details" do
            expect { described_class.new(user, transaction_entry, params).save }
              .to change { Transaction::Detail.count }
              .by(+2)
          end
        end
      end

      context "when creating a budget exclusion" do
        let(:budget_exclusion) { true }

        context "when the account is non-cash-flow" do
          let(:account) { FactoryBot.create(:account, :non_cash_flow, user_group: user.group) }
          let(:transaction_entry) { Transaction::Entry.new(account: account) }
          let(:details_attributes) { [{ key: SecureRandom.hex(6), amount: 250_00 }] }

          it "returns true" do
            expect(described_class.new(user, transaction_entry, params).save)
              .to be true
          end

          it "creates the transation entry" do
            expect { described_class.new(user, transaction_entry, params).save }
              .to change { Transaction::Entry.budget_exclusions.count }
              .by(+1)
          end
        end

        context "when the account is cash-flow" do
          let(:account) { FactoryBot.create(:account, :cash_flow, user_group: user.group) }
          let(:transaction_entry) { Transaction::Entry.new(account: account) }
          let(:details_attributes) { [{ key: SecureRandom.hex(6), amount: 250_00 }] }

          it "returns false" do
            expect(described_class.new(user, transaction_entry, params).save)
              .to be false
          end

          it "does not create a transaction entry" do
            expect { described_class.new(user, transaction_entry, params).save }
              .not_to(change { Transaction::Entry.budget_exclusions.count })
          end

          it "includes an error" do
            subject = described_class.new(user, transaction_entry, params).tap(&:save)
            expect(subject.errors[:budget_exclusion])
              .to eq(["Budget Exclusions only applicable for non-cashflow accounts"])
          end
        end

        context "when providing a budget item with the detail" do
          let(:account) { FactoryBot.create(:account, :non_cash_flow, user_group: user.group) }
          let(:transaction_entry) { Transaction::Entry.new(account: account) }
          let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.group) }
          let(:details_attributes) do
            [
              {
                key: SecureRandom.hex(6),
                amount: 250_00,
                budget_item_id: budget_item.id,
              },
            ]
          end

          it "returns false" do
            expect(described_class.new(user, transaction_entry, params).save)
              .to be false
          end

          it "does not create a transaction entry" do
            expect { described_class.new(user, transaction_entry, params).save }
              .not_to(change { Transaction::Entry.budget_exclusions.count })
          end

          it " includes an error" do
            subject = described_class.new(user, transaction_entry, params).tap(&:save)
            expect(subject.errors[:budget_exclusion])
              .to eq(["Budget Exclusions cannot be associated with a budget item"])
          end
        end

        context "when providing multiple details" do
          let(:account) { FactoryBot.create(:account, :non_cash_flow, user_group: user.group) }
          let(:transaction_entry) { Transaction::Entry.new(account: account) }
          let(:details_attributes) do
            [
              { key: SecureRandom.hex(6), amount: 250_00 },
              { key: SecureRandom.hex(6), amount: 250_00 },
            ]
          end

          it "returns false" do
            expect(described_class.new(user, transaction_entry, params).save)
              .to be false
          end

          it "does not create a transation entry" do
            expect { described_class.new(user, transaction_entry, params).save }
              .not_to(change { Transaction::Entry.budget_exclusions.count })
          end

          it "includes an error" do
            subject = described_class.new(user, transaction_entry, params).tap(&:save)
            expect(subject.errors[:budget_exclusion])
              .to eq(["Cannot have multiple details for budget exclusion"])
          end
        end
      end

      context "when creating multiple details with the same key" do
        let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.user_group) }
        let(:additional_budget_item) { FactoryBot.create(:budget_item, user_group: user.user_group) }
        let(:key) { SecureRandom.hex(6) }
        let(:details_attributes) do
          [
            { key: key, amount: 100_00, budget_item_id: additional_budget_item.id },
            { key: key, amount: 100_00, budget_item_id: budget_item.id },
          ]
        end

        it "does not create a transaction entry" do
          expect { described_class.new(user, transaction_entry, params).save }
            .not_to(change { Transaction::Entry.count })
        end

        it "returns false" do
          expect(described_class.new(user, transaction_entry, params).save)
            .to be false
        end

        it "includes an error" do
          subject = described_class.new(user, transaction_entry, params).tap(&:save)
          expect(subject.errors[:details])
            .to eq(["keys must be unique"])
        end
      end

      context "when passing a user that does not have access to the account" do
        let(:other_user) { FactoryBot.create(:user) }
        let(:details_attributes) { [{ key: SecureRandom.hex(6), amount: 100_00 }] }

        it "does not create a transaction entry" do
          expect { described_class.new(other_user, transaction_entry, params).save }
            .not_to(change { Transaction::Entry.count })
        end

        it "returns false" do
          expect(described_class.new(other_user, transaction_entry, params).save)
            .to be false
        end

        it "includes an error message" do
          subject = described_class.new(other_user, transaction_entry, params).tap(&:save)
          expect(subject.errors[:account]).to eq(["not found"])
        end
      end

      context "when not passing any details" do
        let(:details_attributes) { [] }

        it "does not create a transaction entry" do
          expect { described_class.new(user, transaction_entry, params).save }
            .not_to(change { Transaction::Entry.count })
        end

        it "returns false" do
          expect(described_class.new(user, transaction_entry, params).save)
            .to be false
        end

        it "includes an error message" do
          subject = described_class.new(user, transaction_entry, params).tap(&:save)
          expect(subject.errors[:details])
            .to eq(["Must have at least one detail for this entry"])
        end
      end
    end

    context "when updating an existing transaction" do
      let(:user) { FactoryBot.create(:user) }
      let(:account) { FactoryBot.create(:account, user_group: user.group) }
      let(:transaction_entry) { FactoryBot.create(:transaction_entry, account: account) }

      context "when updating the account" do
        context "when switching to another account the user has access to" do
          let(:alternate_account) { FactoryBot.create(:savings_account, user_group: user.group) }

          it "updates the account id" do
            expect { described_class.new(user, transaction_entry, { account: alternate_account }).save }
              .to change { transaction_entry.reload.account_id }
              .from(account.id)
              .to(alternate_account.id)
          end
        end

        context "when switching to another account the user does not have access to" do
          let(:alternate_account) { FactoryBot.create(:account) }

          it "does not update the account it" do
            subject = described_class.new(user, transaction_entry, { account: alternate_account })
            expect { subject.save }
              .not_to(change { transaction_entry.reload.account_id })
          end

          it "includes an error" do
            subject = described_class.new(user, transaction_entry, { account: alternate_account }).tap(&:save)
            expect(subject.errors[:account])
              .to eq(["not found"])
          end
        end
      end

      context "when adding a transaction detail" do
        let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.group) }

        it "creates a transaction detail" do
          expect do
            described_class.new(
              user,
              transaction_entry,
              details_attributes: [{ key: SecureRandom.hex(6), amount: 45_00, budget_item_id: budget_item.id }],
            ).save
          end.to change { transaction_entry.reload.details.count }.by(+1)
        end
      end

      context "when deleting a single transaction detail" do
        it "does not delete the transaction detail" do
          params = {
            details_attributes: [
              {
                id: transaction_entry.details.first.id,
                _destroy: true,
              },
            ],
          }
          expect { described_class.new(user, transaction_entry, params).save }
            .not_to(change { transaction_entry.reload.details.count })
        end
      end

      context "when deleting a transaction detail" do
        let(:transaction_entry) do
          FactoryBot.create(:transaction_entry, :with_multiple_details, account: account)
        end

        it "deletes the transaction detail" do
          params = {
            details_attributes: [
              {
                id: transaction_entry.details.pluck(:id).sample, _destroy: true,
              },
            ],
          }
          expect { described_class.new(user, transaction_entry, params).save }
            .to change { transaction_entry.reload.details.count }
            .by(-1)
        end
      end

      context "when updating one (of multiple) transaction detail" do
        let(:transaction_entry) do
          FactoryBot.create(:transaction_entry, :with_multiple_details, account: account)
        end

        it "updates the targeted detail" do
          detail = transaction_entry.details.first
          params = {
            details_attributes: [
              { id: detail.id, amount: 342_25 },
            ],
          }

          expect { described_class.new(user, transaction_entry, params).save }
            .to change { detail.reload.amount }
            .to(342_25)
        end

        it "does not change the other details" do
          detail = transaction_entry.details.first
          updated_at = -> { transaction_entry.reload.details.where.not(id: detail.id).pluck(:updated_at) }
          params = { details_attributes: [{ id: detail.id, amount: 342_25 }] }

          expect { described_class.new(user, transaction_entry, params).save }
            .not_to(change { updated_at.call })
        end
      end

      context "when the transaction entry is a budget exclusion" do
        let(:savings_account) { FactoryBot.create(:savings_account, user_group: user.group) }
        let(:transaction_entry) do
          FactoryBot.create(:transaction_entry, :budget_exclusion, account: savings_account)
        end

        context "when the updated account is cash flow" do
          it "does not update the transaction entry's account id" do
            expect { described_class.new(user, transaction_entry, account: account).save }
              .not_to(change { transaction_entry.reload.account_id })
          end

          it "includes an error" do
            subject = described_class.new(user, transaction_entry, account: account).tap(&:save)

            expect(subject.errors[:budget_exclusion])
              .to eq(["Budget Exclusions only applicable for non-cashflow accounts"])
          end
        end

        context "when the updated account is non cash flow" do
          let(:alt_savings_account) { FactoryBot.create(:savings_account, user_group: user.group) }

          it "updates the transaction entry's account id" do
            expect { described_class.new(user, transaction_entry, account: alt_savings_account).save }
              .to change { transaction_entry.reload.account_id }
              .from(savings_account.id)
              .to(alt_savings_account.id)
          end
        end

        context "when adding a detail" do
          it "does not create a detail" do
            params = { details_attributes: [{ key: SecureRandom.hex(6), amount: 55_82 }] }

            expect { described_class.new(user, transaction_entry, params).save }
              .not_to(change { transaction_entry.reload.details.count })
          end

          it "includes an error" do
            params = { details_attributes: [{ key: SecureRandom.hex(6), amount: 55_82 }] }

            subject = described_class.new(user, transaction_entry, params).tap(&:save)

            expect(subject.errors[:budget_exclusion])
              .to eq(["Cannot have multiple details for budget exclusion"])
          end
        end

        context "when updating the single detail with a budget item" do
          let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.group) }

          it "does not change the detail" do
            detail = transaction_entry.details.first
            params = { details_attributes: [{ id: detail.id, budget_item_id: budget_item.id }] }

            expect { described_class.new(user, transaction_entry, params).save }
              .not_to(change { detail.reload })
          end

          it "includes an error" do
            detail = transaction_entry.details.first
            params = { details_attributes: [{ id: detail.id, budget_item_id: budget_item.id }] }

            subject = described_class.new(user, transaction_entry, params).tap(&:save)

            expect(subject.errors[:budget_exclusion])
              .to eq(["Budget Exclusions cannot be associated with a budget item"])
          end
        end
      end

      context "when the transaction entry is a part of a transfer" do
        let(:savings_account) { FactoryBot.create(:savings_account, user_group: user.group) }
        let(:to_transaction) { FactoryBot.create(:transaction_entry, :discretionary, account: savings_account) }
        let(:from_transaction) { FactoryBot.create(:transaction_entry, :discretionary, account: account) }

        before do
          FactoryBot.create(:transfer, to_transaction: to_transaction, from_transaction: from_transaction)
        end

        context "when adding a detail" do
          it "does not create a detail" do
            params = { details_attributes: [{ key: SecureRandom.hex(6), amount: 55_82 }] }

            expect { described_class.new(user, to_transaction, params).save }
              .not_to(change { to_transaction.reload.details.count })
          end

          it "includes an error" do
            params = { details_attributes: [{ key: SecureRandom.hex(6), amount: 55_82 }] }

            subject = described_class.new(user, to_transaction, params).tap(&:save)

            expect(subject.errors[:transfer])
              .to eq(["Cannot have multiple details for transfer"])
          end
        end

        context "when updating the single detail with a budget item" do
          let(:budget_item) { FactoryBot.create(:budget_item, user_group: user.group) }

          it "does not change the detail" do
            detail = to_transaction.details.first
            params = { details_attributes: [{ id: detail.id, budget_item_id: budget_item.id }] }

            expect { described_class.new(user, to_transaction, params).save }
              .not_to(change { detail.reload })
          end

          it "includes an error" do
            detail = to_transaction.details.first
            params = { details_attributes: [{ id: detail.id, budget_item_id: budget_item.id }] }

            subject = described_class.new(user, to_transaction, params).tap(&:save)

            expect(subject.errors[:transfer])
              .to eq(["Transfer cannot be associated with a budget item"])
          end
        end
      end
    end
  end
end
