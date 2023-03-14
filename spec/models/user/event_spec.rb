require "rails_helper"

RSpec.describe User::Event do
  it "defaults an empty hash for data" do
    expect(described_class.new.data).to eq({})
  end

  it { is_expected.to belong_to(:actor) }
  it { is_expected.to belong_to(:target_user) }
  it { is_expected.to belong_to(:user_event_type) }
end
