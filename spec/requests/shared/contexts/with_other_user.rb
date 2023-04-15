require "rails_helper"

RSpec.shared_context "with another user group" do
  let(:other_user) { FactoryBot.create(:user) }
  let(:other_user_group) { other_user.group }

  before { other_user }
end

RSpec.shared_context "with an account belonging to a different user group" do
  include_context "with another user group"

  let(:other_groups_account) do
    FactoryBot.create(:account, user_group: other_user_group)
  end

  before { other_groups_account }
end
