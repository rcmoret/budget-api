require_relative "seeds/item_amounts"

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
