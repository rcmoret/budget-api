module API
  module V1
    module Accounts
      class IndexSerializer < ::Serializers::GenericSerializer
        attributes :key, :name, :slug, :balance
      end
    end
  end
end
