SELECT up.id as user_profile_id,
       uco.description,
       coalesce(uc.value, uco.default_value) as value
FROM user_configuration_options uco
LEFT outer join user_configurations uc on uc.user_configuration_option_id = uco.id
LEFT outer join user_profiles up on up.id = uc.user_profile_id

