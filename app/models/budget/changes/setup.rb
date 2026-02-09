module Budget
  module Changes
    class Setup < ChangeSet
      include BelongsToUserGroup::Through[
        association: :interval,
        class_name: "Budget::Interval"
      ]

      validates :interval_id, uniqueness: true

      NEW_ADJUSTMENT = lambda { |key: KeyGenerator.call|
        { key => { cents: 0, display: "" } }
      }

      def self.start!
        change_set = new(key: generate_key)
        raise ArgumentError, "must define interval" if new.interval.nil?

        change_set.assign_categories
      end

      attr_accessor :user_profile

      def events_form
        Forms::Budget::EventsForm.new(
          user_profile,
          self,
          events: reducer.events
        )
      end

      def reset_data!
        update_categories
        assign_categories
      end

      def data_model
        Presenters::DataModel.new(self)
      end

      delegate :categories, :slugs, to: :data_model

      def refresh_category!(category_record)
        update_category_data(slug: category_record.slug) do |_, events, keys|
          presenter_for(category_record, keys:) do
            events.map(&:adjustment_hash).reduce(&:merge)
          end
        end
      end

      def update_category_events(category_record, events: {})
        update_category_data(slug: category_record.slug) do |category, _, keys|
          presenter_for(category_record, keys:) do
            category.events.map(&:adjustment_hash).reduce(&:merge).merge(events)
          end
        end
      end

      def remove_event(slug:, key:)
        update_category_data(slug:) do |category_data, _, _|
          events = category_data.events.reject do |ev|
            ev.budget_item_key == key
          end

          next if events.empty?

          category_data.to_h.merge(events: events.map(&:to_h))
        end
      end

      def assign_categories
        presenter = Presenters::ChangePresenter.new(
          interval:,
          category_scope:,
          budget_items: setup_budget_items.to_a,
        )
        self.events_data ||= {}
        self.events_data[:categories] = presenter.categories.map(&:to_h)
        tap(&:save)
      end

      def update_category_data(slug:, &block)
        next_categories = categories.filter_map do |category_data|
          next category_data.to_h unless category_data.slug == slug

          block.call(
            category_data,
            category_data.events,
            category_data.budget_item_keys
          )
        end

        update_categories(*next_categories)
      end

      def add_item_event(category_record)
        if slugs.include?(category_record.slug)
          append_category_event(category_record:)
        else
          add_new_category(category_record:)
        end
      end

      private

      def setup_budget_items
        @setup_budget_items ||=
          ::Budget::Item
          .includes(:transaction_details, :events)
          .active
          .belonging_to(user_group)
          .where(interval: [ interval, interval.prev ])
          .map(&:decorated)
      end

      def category_scope
        ::Budget::Category
          .includes(maturity_intervals: :interval)
          .where(id: setup_budget_items.map(&:budget_category_id))
          .belonging_to(user_group)
      end

      def update_categories(*categories_data)
        next_data = events_data.merge(categories: categories_data.map(&:to_h))

        update(events_data: next_data)
      end

      def append_category_event(category_record:)
        update_category_data(slug: category_record.slug) do |_, events, keys|
          presenter_for(category_record, keys:) do
            events.map(&:adjustment_hash).reduce(NEW_ADJUSTMENT.call, &:merge)
          end
        end
      end

      def add_new_category(category_record:)
        key = KeyGenerator.call
        new_category = presenter_for(category_record, keys: Array.wrap(key)) do
          NEW_ADJUSTMENT.call(key:)
        end

        update_categories(*categories, new_category)
      end

      def reducer
        Presenters::EventsReducer.new(self)
      end

      def presenter_for(category_record, keys:, &block)
        Presenters::CategoryPresenter.hashify(
          category_record,
          interval:,
          keys:,
          adjustments: block.call
        )
      end
    end
  end
end
