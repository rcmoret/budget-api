class Current < ActiveSupport::CurrentAttributes
  attribute :user_profile, :user_group

  resets { Time.zone = nil }

  def user_profile=(user_profile)
    super
    self.user_group = user_profile.group
    Time.zone = user_profile.configuration(:timezone)
  end
end
