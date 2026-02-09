module WebApp
  module Budget
    module Items
      class DetailsSerializer < ApplicationSerializer
        attribute :transaction_details,
          each_serializer: TransactionDetailSerializer
        attribute :events, each_serializer: EventSerializer
      end
    end
  end
end
