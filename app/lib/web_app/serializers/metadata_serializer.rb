# frozen_string_literal: true

module WebApp
  class MetadataSerializer < Serializers::GenericSerializer
    attributes :namespace,
      :prev_selected_account_path,
      :user_key

    attribute :page_name do |presenter|
      presenter.options.fetch(:page_name, "page")
    end
  end
end
