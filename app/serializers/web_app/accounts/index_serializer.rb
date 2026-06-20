module WebApp
  module Accounts
    class IndexSerializer < ApplicationSerializer
      include Alba::Resource
      include Mixins::NotificationsConcern

      many :accounts, resource: AccountResource
      one :metadata, resource: MetadataSerializer

      transform_keys :lower_camel
    end
  end
end
