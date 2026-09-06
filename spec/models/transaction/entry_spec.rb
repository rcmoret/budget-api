require "rails_helper"

RSpec.describe Transaction::Entry do
  it { is_expected.to belong_to(:account) }
  it { is_expected.to have_many(:details) }
  it { is_expected.to accept_nested_attributes_for(:details) }

  describe "#<=>" do
    context "when both entries are cleared, but on different days" do
      let(:yesterday) { 1.day.ago.to_date }

      let(:yesterday_transaction) do
        build(
          :transaction_entry,
          key: "aaabbbcccddd",
          clearance_date: yesterday
        )
      end
      let(:last_week_transaction) do
        build(
          :transaction_entry,
          key: "111222333444",
          clearance_date: 7.days.ago
        )
      end

      it "sorts on clearance date: most recent first" do
        sorted = [ last_week_transaction, yesterday_transaction ].sort
        expect(sorted).to eq [ yesterday_transaction, last_week_transaction ]
      end
    end

    context "when both entries are cleared on the same day" do
      let(:yesterday) { 1.day.ago.to_date }

      let(:transaction_1) do
        build(
          :transaction_entry,
          key: "aaabbbcccddd",
          updated_at: Time.current,
          clearance_date: yesterday
        )
      end
      let(:transaction_2) do
        build(
          :transaction_entry,
          key: "111222333444",
          updated_at: 1.hour.ago,
          clearance_date: yesterday
        )
      end

      it "sorts by updated_at: most recent first" do
        sorted = [ transaction_2, transaction_1 ].sort
        expect(sorted).to eq [ transaction_1, transaction_2 ]
      end
    end

    context "when both are pending" do
      let(:transaction_1) do
        build(
          :transaction_entry,
          key: "aaabbbcccddd",
          updated_at: Time.current,
          clearance_date: nil
        )
      end
      let(:transaction_2) do
        build(
          :transaction_entry,
          key: "111222333444",
          updated_at: 1.hour.ago,
          clearance_date: nil
        )
      end

      it "sorts by updated_at: most recent first" do
        sorted = [ transaction_2, transaction_1 ].sort
        expect(sorted).to eq [ transaction_1, transaction_2 ]
      end
    end

    context "when the first is cleared and the other is pending" do
      context "when the cleared transaction is in the future" do
        let(:transaction_1) do
          build(
            :transaction_entry,
            key: "aaabbbcccddd",
            clearance_date: 1.day.from_now
          )
        end
        let(:transaction_2) do
          build(
            :transaction_entry,
            key: "111222333444",
            clearance_date: nil
          )
        end

        it "sorts future clearance_date before pending" do
          sorted = [ transaction_2, transaction_1 ].sort
          expect(sorted).to eq [ transaction_1, transaction_2 ]
        end
      end

      context "when the cleared transaction is in the past" do
        let(:transaction_1) do
          build(
            :transaction_entry,
            key: "aaabbbcccddd",
            clearance_date: 1.month.ago
          )
        end
        let(:transaction_2) do
          build(
            :transaction_entry,
            key: "111222333444",
            clearance_date: nil
          )
        end

        it "sorts pending before past" do
          sorted = [ transaction_1, transaction_2 ].sort
          expect(sorted).to eq [ transaction_2, transaction_1 ]
        end
      end
    end

    context "when the first is pending and the other is cleared" do
      context "when the cleared transaction is in the future" do
        let(:transaction_1) do
          build(
            :transaction_entry,
            key: "aaabbbcccddd",
            clearance_date: nil
          )
        end
        let(:transaction_2) do
          build(
            :transaction_entry,
            key: "111222333444",
            clearance_date: 1.day.from_now
          )
        end

        it "sorts future clearance_date before pending" do
          sorted = [ transaction_1, transaction_2 ].sort
          expect(sorted).to eq [ transaction_2, transaction_1 ]
        end
      end

      context "when the cleared transaction is in the past" do
        let(:transaction_1) do
          build(
            :transaction_entry,
            key: "aaabbbcccddd",
            clearance_date: nil
          )
        end
        let(:transaction_2) do
          build(
            :transaction_entry,
            key: "111222333444",
            clearance_date: 1.month.ago
          )
        end

        it "sorts pending before past" do
          sorted = [ transaction_1, transaction_2 ].sort
          expect(sorted).to eq [ transaction_2, transaction_1 ]
        end
      end
    end
  end

  describe ".between" do
    before do
      travel_to(Date.new(2016, 3, 14)) do
        create_account_entries(account, 2.days.from_now)
      end
    end

    let(:account) { create(:account) }
    let!(:old_transactions) { create_account_entries(account, 2.days.ago) }
    let!(:this_months) { create_account_entries(account, 2.days.ago) }
    let(:pending) { create_account_entries(account, nil) }
    let(:dates) { (2.months.ago..Time.zone.today) }

    context "when pending false (default)" do
      subject { described_class.between(dates) }

      it { expect(subject).to include_these(*old_transactions) }
      it { expect(subject).to include_these(*this_months) }
      it { expect(subject).not_to include_these(*pending) }
    end

    context "when pending true" do
      subject { described_class.between(dates, include_pending: true) }

      it { expect(subject).to include_these(*old_transactions) }
      it { expect(subject).to include_these(*this_months) }
      it { expect(subject).to include_these(*pending) }
    end
  end

  describe "validation around budget exclusions" do
    subject { transaction_entry.valid? }

    let(:transaction_entry) do
      build(:transaction_entry,
        details_attributes: [
          {
            key: KeyGenerator.call,
            amount: rand(10_000),
            budget_item_id: nil,
          },
        ],
        budget_exclusion: true,
        account:)
    end

    context "when account is a non-cashflow account" do
      let(:account) { create(:account, :non_cash_flow) }

      it { is_expected.to be true }
    end

    context "when there are no details" do
      subject { transaction }

      let(:transaction) do
        build(
          :transaction_entry,
          :budget_exclusion,
          details_attributes: [],
        )
      end

      it { expect(subject.valid?).to be false }

      it "includes an error message" do
        subject.valid?
        expect(subject.errors["details"])
          .to include "This type of transaction (budget_exclusion) " \
                      "must have exactly 1 detail"
      end
    end

    context "when there are multiple details" do
      subject { transaction }

      before do
        transaction.details.build(amount: -100_00)
      end

      let(:transaction) do
        build(:transaction_entry, :budget_exclusion)
      end

      it "does not allow a second detail" do
        expect { subject }.not_to(change { transaction.details.reload })
      end

      it "contains an error message" do
        subject.valid?
        expect(subject.errors["budget_exclusion"])
          .to include "Cannot have multiple details for budget exclusion"
      end
    end
  end

  describe "notes" do
    let(:transaction_entry) { create(:transaction_entry, notes:) }

    context "when notes contains text" do
      let(:notes) do
        {
          "type" => "doc",
          "content" => [
            {
              "type" => "paragraph",
              "content" => [ { "type" => "text", "text" => "hello" } ],
            },
          ],
        }
      end

      it "persists the notes doc" do
        expect(transaction_entry.reload.notes).to eq(notes)
      end
    end

    context "when notes has no text content" do
      let(:notes) do
        { "type" => "doc", "content" => [ { "type" => "paragraph" } ] }
      end

      it "nullifies notes on save" do
        expect(transaction_entry.reload.notes).to be_nil
      end
    end

    context "when notes is nil" do
      let(:notes) { nil }

      it "leaves notes as nil" do
        expect(transaction_entry.reload.notes).to be_nil
      end
    end
  end

  describe "validation around transfers" do
    context "when there no detail is provided" do
      let(:transaction) do
        build(
          :transaction_entry,
          details_attributes: [],
        )
      end

      it { expect(transaction.valid?).to be false }

      it "contains errors" do
        transaction.valid?
        expect(transaction.errors[:details])
          .to include "Must have at least one detail for this entry"
      end
    end

    context "when updating other attributes" do
      let(:transfer) { create(:transfer) }
      let(:transaction) { transfer.from_transaction }

      it "allows other attributes to be updated" do
        expect(transaction.update(clearance_date: Time.zone.today)).to be true
      end
    end
  end

  def create_account_entries(account, date)
    create_list(
      :transaction_entry,
      2,
      account:,
      clearance_date: date,
    )
  end
end
