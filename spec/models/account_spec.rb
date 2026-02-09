require "rails_helper"

RSpec.describe Account do
  it { is_expected.to have_many(:transactions) }

  describe "activereocord validations" do
    subject { build(:account) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:priority) }

    it do
      expect(subject)
        .to validate_uniqueness_of(:priority)
        .scoped_to(:user_group_id)
    end

    it {
      expect(subject).to validate_uniqueness_of(:name).scoped_to(:user_group_id)
    }

    it {
      expect(subject).to validate_uniqueness_of(:slug).scoped_to(:user_group_id)
    }
  end

  describe "slug format validation" do
    subject { build(:account) }

    context "when it is all lower case with a dash" do
      it "is valid" do
        account = build(:account, slug: "bank-acct")
        expect(account.valid?).to be true
      end
    end

    context "when it is has uppercase" do
      let(:error_msg) do
        "must be combination of lowercase letters, numbers and dashes"
      end

      it "is valid" do
        account = build(:account, slug: "bankAcct")
        expect(account.valid?).to be false
        expect(account.errors[:slug])
          .to include error_msg
      end
    end
  end

  describe "#destroy" do
    subject { account.destroy }

    let(:account) { create(:account) }

    context "when transactions exist" do
      before { create(:transaction_entry, account:) }

      it "soft deletes the account" do
        expect { subject }.to(change { account.reload.archived_at })
      end

      it "does not change the number of accounts" do
        expect { subject }.not_to(change { described_class.count })
      end
    end

    context "when no transactions exist" do
      before { account }

      it "hard deletes the account" do
        expect { subject }.to change { described_class.count }.by(-1)
      end
    end
  end
end
