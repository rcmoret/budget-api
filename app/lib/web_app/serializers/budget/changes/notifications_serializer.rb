module WebApp
  module Budget
    module Changes
      class NotificationsSerializer
        include Alba::Resource

        attributes :messages

        def messages(events)
          {}
        end
      end
    end
  end
end
