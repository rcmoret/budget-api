require "rails_helper"

RSpec.describe API::Budget::Categories::MaturityIntervalSerializer do
  subject { described_class.new(maturity_interval) }

  let(:maturity_interval) { create(:maturity_interval) }
  let(:category) { maturity_interval.category }
  let(:interval) { maturity_interval.interval }

  describe "key" do
    it "returns the category's key" do
      expect(subject.key).to eq category.key
    end
  end
end
