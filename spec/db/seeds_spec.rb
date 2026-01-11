require "rails_helper"
require_relative "../../db/seeds/item_amounts"

# rubocop:disable RSpec/DescribeClass
RSpec.describe "seeding the db" do
  subject(:task) do
    lambda do
      ApplicationRecord.transaction do
        %i[
          user_group
          user_profile
          account
          icon
          budget_category
          budget_interval
          account_transaction
        ].each do |filename|
          path = Rails.root.join("db", "seeds", "#{filename}.rb").to_s

          # rubocop:disable Rails/Output: Do not write to stdout
          puts "[ Loading Seed path: #{path} ]"
          # rubocop:enable Rails/Output: Do not write to stdout
          load path
        end
      end
    end
  end

  it "creates new transactions" do
    expect { task.call }.to change { Transaction::Entry.count }.by(14)
  end
end
# rubocop:enable RSpec/DescribeClass
