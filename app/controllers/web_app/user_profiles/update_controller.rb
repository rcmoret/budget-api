# frozen_string_literal: true

module WebApp
  module UserProfiles
    # Updates the current profile's timezone/theme configuration and/or
    # password. All fields are optional: a blank password leaves the
    # credential untouched, and an unchanged timezone or theme is a no-op.
    class UpdateController < BaseController
      def call
        update_password!
        update_timezone!
        update_theme_preference!
        set_flash!

        redirect_to manage_profile_path
      end

      private

      def update_password!
        return if password_param.blank?

        if password_param != password_confirmation_param
          errors << "Password confirmation doesn't match."
          return
        end

        if current_user_profile.update(password: password_param)
          # The password digest changed; re-authenticate the current session
          # so the redirect doesn't bounce the user to the sign-in page.
          bypass_sign_in(current_user_profile)
          changes << "password"
        else
          errors.concat(current_user_profile.errors.full_messages)
        end
      end

      def update_timezone!
        return if timezone_param.blank?
        return if timezone_param == current_timezone

        configuration = User::Configuration.find_or_initialize_by(
          user_profile: current_user_profile,
          user_configuration_option_id: timezone_option.id,
        )
        # Assign the association explicitly: on the initialize path (no existing
        # row) find_or_initialize_by leaves `option` nil, which breaks the
        # `timezone_config?` validation that delegates to it.
        configuration.option = timezone_option
        configuration.value = timezone_param

        if configuration.save
          changes << "timezone"
        else
          errors.concat(configuration.errors.full_messages)
        end
      end

      # This only changes what a *new* session (a new tab/window) starts out
      # as — the frontend's own dark-mode toggle keeps working unchanged for
      # the current session, tracked client-side rather than here.
      def update_theme_preference!
        return if theme_preference_param.blank?
        return if theme_preference_param == current_theme_preference

        configuration = User::Configuration.find_or_initialize_by(
          user_profile: current_user_profile,
          user_configuration_option_id: theme_preference_option.id,
        )
        configuration.option = theme_preference_option
        configuration.value = theme_preference_param

        if configuration.save
          changes << "theme"
        else
          errors.concat(configuration.errors.full_messages)
        end
      end

      def set_flash!
        if errors.any?
          flash[:alert] = errors
        elsif changes.any?
          flash[:notice] = "Profile updated (#{changes.join(', ')})."
        end
      end

      def timezone_option
        @timezone_option ||=
          User::ConfigurationOption.find_by!(description: "timezone")
      end

      def theme_preference_option
        @theme_preference_option ||=
          User::ConfigurationOption.find_by!(description: "theme_preference")
      end

      def current_timezone = current_user_profile.configuration(:timezone)

      def current_theme_preference
        current_user_profile.configuration(:theme_preference)
      end

      def changes = @changes ||= []

      def errors = @errors ||= []

      def update_params
        params
          .require(:user_profile)
          .permit(:timezone, :password, :password_confirmation, :theme_preference)
      end

      def password_param = update_params[:password]

      def password_confirmation_param = update_params[:password_confirmation]

      def timezone_param = update_params[:timezone]

      def theme_preference_param = update_params[:theme_preference]
    end
  end
end
