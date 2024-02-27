require "rails_helper"

RSpec.describe Budget::ItemEvent do
  subject { create(:budget_item_event) }

  it { is_expected.to belong_to(:item) }
end
