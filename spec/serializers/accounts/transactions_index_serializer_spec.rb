require "rails_helper"

RSpec.describe Accounts::TransactionsIndexSerializer do
  describe "#transactions" do
    context "when the interval is current" do
      it "includes pending transactions"
    end

    context "when the interval is past" do
      it "does not include pending transactions"
    end
  end
end
