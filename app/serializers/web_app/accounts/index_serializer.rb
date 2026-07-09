module WebApp
  module Accounts
    class IndexSerializer < PageSerializer
      many :accounts, resource: AccountResource

      transform_keys :lower_camel
    end
  end
end
