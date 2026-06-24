module Budget
  module Changes
    class Rollover < ChangeSet
      validates :interval_id, uniqueness: true

      def self.start!
        change_set = new(key: generate_key)
        raise ArgumentError, "must define interval" if new.interval.nil?

        change_set.assign_categories
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
    end
  end
end
