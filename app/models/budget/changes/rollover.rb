module Budget
  module Changes
    class Rollover < ChangeSet
      validates :interval_id, uniqueness: true

      def self.start!
        change_set = new(key: KeyGenerator.call)
        raise ArgumentError, "must define interval" if new.interval.nil?

        change_set.assign_categories
      end

      attr_accessor :user_profile

      def data_model
        Setup::Presenters::DataModel.new(self)
      end

      delegate :categories, :slugs, to: :data_model

      def events_form
        Forms::Budget::EventsForm.new(
          user_profile,
          self,
          events: reducer.events
        )
      end

      def assign_categories
        rebuild_categories
      end

      # Unlike setup, rollover never adds or removes categories or items, so a
      # single method handles every edit: merge the incoming adjustments over
      # the stored ones and rebuild the data from the current items.
      def update_data(events: {})
        rebuild_categories(current_adjustments.merge(events))
      end

      private

      def reducer
        Presenters::EventsReducer.new(self)
      end

      def rebuild_categories(adjustments = {})
        presenter = Presenters::ChangePresenter.new(interval:, adjustments:)
        self.events_data ||= {}
        self.events_data[:categories] = presenter.categories.map(&:to_h)
        tap(&:save)
      end

      def current_adjustments
        (events_data || {})
          .deep_stringify_keys
          .fetch("categories", [])
          .flat_map { |category| category.fetch("events", []) }
          .to_h do |event|
            adjustment = event.fetch("adjustment", {}).symbolize_keys
            [ event["budget_item_key"], adjustment ]
          end
      end
    end
  end
end
