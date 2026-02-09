module User
  class EventType < ApplicationRecord
    validates :name, uniqueness: true
    validates :name, format: { with: /\A[a-z][a-z0-9_]*[a-z0-9]\z/ }

    SUBSCRIPTIONS = {
      "expire_current_token" => EventHandlers::ExpireTokenByKey,
      "user_auth_token_requested" => EventHandlers::NewAuthTokenRequested,
    }.freeze

    NullEventHandler = Class.new do
      def initialize(*); end

      def call
        [ :ok ]
      end
    end

    def self.for(name)
      find_or_create_by(name:)
    end

    def subscriber
      SUBSCRIPTIONS.fetch(name) { NullEventHandler }
    end
  end
end
