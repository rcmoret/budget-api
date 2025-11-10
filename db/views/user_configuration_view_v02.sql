SELECT up.id as user_profile_id,
       uco.description,
       coalesce(uc.value, uco.default_value) as value
FROM user_configuration_options uco
CROSS JOIN user_profiles up
LEFT OUTER JOIN user_configurations uc
  ON uc.user_configuration_option_id = uco.id
  AND uc.user_profile_id = up.id
