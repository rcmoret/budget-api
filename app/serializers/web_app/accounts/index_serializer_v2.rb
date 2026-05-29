module WebApp
  module Accounts
    class IndexSerializerV2 < ApplicationSerializer
      include Alba::Resource

      many :accounts, resource: AccountResource

      one :metadata, resource: MetadataSerializer

      nested_attribute :notifications do
        attributes :alerts,
          :info,
          :notices,
          :warnings
      end

      transform_keys :lower_camel
    end
  end
end
