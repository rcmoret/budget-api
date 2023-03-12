source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.0"

gem "bcrypt", "~> 3.1.7"
gem "bootsnap", require: false
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "rails", "~> 7.0.1"
gem "rubocop", require: false
gem "rubocop-rails", require: false
gem "rubocop-rspec", require: false
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]

group :development, :test do
  gem "pry"
  gem "rack-cors"
end

group :test do
  gem "factory_bot"
  gem "rspec-its"
  gem "rspec-rails"
  gem "shoulda-matchers"
end

group :development do
end
