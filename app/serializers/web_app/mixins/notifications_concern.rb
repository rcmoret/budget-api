module WebApp
  module Mixins
    module NotificationsConcern
      extend ActiveSupport::Concern

      included do
        nested_attribute :notifications do
          attribute :alerts do
            Array.wrap(params[:flash][:alerts])
          end
          attribute :info do
            Array.wrap(params[:flash][:info])
          end
          attribute :notices do
            Array.wrap(params[:flash][:notices])
          end
          attribute :warnings do
            Array.wrap(params[:flash][:warnings])
          end

          transform_keys :lower_camel
        end
      end
    end
  end
end
