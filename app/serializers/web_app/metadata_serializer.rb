# frozen_string_literal: true

module WebApp
  class MetadataSerializer
    include Alba::Resource

    attributes :namespace,
      :options,
      :prev_selected_account_path,
      :user_key
  end
end
