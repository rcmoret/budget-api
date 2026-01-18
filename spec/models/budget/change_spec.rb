require "rails_helper"

RSpec.describe Budget::Change do
  let(:interval) { create(:budget_interval) }

  describe ".start_setup!" do
    it "creates a new change entry" do
      expect { described_class.where(interval: interval).start_setup! }
        .to change { described_class.count }
        .by(+1)
    end
  end
end
