module WebApp
  module Mixins
    module FormatDateTime
      def render_date_time(timestamp, format = "%F")
        return if timestamp.nil?

        timestamp.in_time_zone(timezone).strftime(format)
      end

      private

      def timezone
        if defined?(current_user_profile)
          current_user_profile.configuration(:timezone)
        else
          User::ConfigurationOption.find_by(description: :timezone).default_value
        end
      end
    end
  end
end
