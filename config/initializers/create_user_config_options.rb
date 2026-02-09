Rails.configuration.after_initialize do
  unless ActiveRecord::Base.connection.migration_context.needs_migration?
    file = File.read("config/user_configs/options.yml")
    YAML
      .load(file)
      .fetch("user_configuration_options")
      .map(&:freeze)
      .each do |config_option|
        record = User::ConfigurationOption.find_or_initialize_by(
          description: config_option["description"]
        )
        next if record.default_value == config_option["default"]

        record.update!(default_value: config_option["default"])
      end
  end
end
