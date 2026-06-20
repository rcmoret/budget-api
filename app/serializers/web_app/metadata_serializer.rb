# frozen_string_literal: true

module WebApp
  class MetadataSerializer
    include Alba::Resource

    attributes :namespace,
      :prev_selected_account_path,
      :user_key

    attribute :page_name do |presenter|
      presenter.options.fetch(:page_name, "page")
    end

    transform_keys :lower_camel
  end
end
