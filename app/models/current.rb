class Current < ActiveSupport::CurrentAttributes
  attribute :user_profile, :user_group, :profile_key

  resets { Time.zone = nil }

  def user_profile=(user_profile)
    super
    self.user_group = user_profile.group
    self.profile_key = user_profile.key
    Time.zone = user_profile.configuration(:timezone)
  end
end
