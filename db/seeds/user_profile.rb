User::Group.find_by!(name: "Initial User Group").then do |group|
  profile = group.users.find_or_initialize_by(
    email: group.primary_email,
  )

  if profile.new_record?
    profile.key = KeyGenerator.call
    profile.password = "password!234"
    profile.password_confirmation = "password!234"
    profile.save
  end
end
