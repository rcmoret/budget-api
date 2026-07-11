module WebApp
  module Serializers
    module Budget
      module Items
        # DEPRECATED: This serializer was built on the hand-rolled
        # ApplicationSerializer and is no longer wired up to a live endpoint.
        # It has been neutered while we migrate serialization to Alba.
        #
        # TODO: Revisit and reimplement as an Alba::Resource (see the ported
        # transactions serializers for the target pattern), then restore the
        # controller wiring in WebApp::Budget::Items::EventsIndexController.
        class DetailsSerializer
          def initialize(*)
            raise NotImplementedError,
              "#{self.class} is deprecated and pending reimplementation with Alba"
          end

          # attribute :transaction_details,
          #   each_serializer: TransactionDetailSerializer
          # attribute :events, each_serializer: EventSerializer
        end
      end
    end
  end
end
