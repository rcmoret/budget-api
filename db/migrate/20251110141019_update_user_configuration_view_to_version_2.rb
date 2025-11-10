# frozen_string_literal: true

class UpdateUserConfigurationViewToVersion2 < ActiveRecord::Migration[7.0]
  def change
    update_view :user_configuration_view, version: 2, revert_to_version: 1
  end
end

