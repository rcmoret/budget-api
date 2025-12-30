# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
filter_params = %i[
  passw secret token crypt salt certificate otp ssn
]

# Only filter _key parameters in non-development environments
filter_params << :_key unless Rails.env.development?

Rails.application.config.filter_parameters += filter_params
