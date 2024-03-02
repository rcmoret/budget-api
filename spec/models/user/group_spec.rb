require "rails_helper"

RSpec.describe User::Group do
  it { is_expected.to have_many(:accounts) }
end
