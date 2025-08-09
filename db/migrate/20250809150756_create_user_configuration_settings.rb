class CreateUserConfigurationSettings < ActiveRecord::Migration[7.0]
  def change
    create_view :user_configuration_view
  end
end
