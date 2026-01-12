group = User::Group.find_or_initialize_by(
  name: "Initial User Group",
  primary_email: "ryan@example.com",
)

group.update!(key: KeyGenerator.call) if group.new_record?
