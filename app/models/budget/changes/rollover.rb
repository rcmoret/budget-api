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
        DataModel.new(self)
      end

      delegate :categories, :slugs, to: :data_model

      def events_reducer
        EventsReducer.new(self)
      end

      def events_form
        Forms::Budget::EventsForm.new(
          user_profile,
          self,
          events: events_reducer.events
        )
      end

      UNAPPLIED_TARGET_ATTRIBUTES = %w[
        key
        event_type
        budget_category_key
        budget_item_key
        name
        slug
      ].freeze

      # Rebuilds the review data from the current budget items. Anything
      # picked so far, including the unapplied target, is dropped.
      def assign_categories
        query = Query::Collection.new(interval)
        self.events_data = {
          "categories" => query.all_details.map(&:to_h),
        }
        tap(&:save)
      end

      alias reset_data! assign_categories

      def update_categories(*categories_data)
        next_data = stored_data.merge(
          "categories" => categories_data.map do |data|
            data.to_h.deep_stringify_keys
          end
        )

        update(events_data: next_data)
      end

      # Creates the rollover events in the upcoming month, closes out the
      # reviewed month and stamps the change set, all or nothing. The review
      # data is kept as a record of what was rolled over.
      def finalize!(user_profile)
        self.user_profile = user_profile
        return false unless finalizable?

        finalized_at = Time.current
        transaction do
          # EventsForm rolls back its own (nested) transaction on errors, but
          # a nested rollback is swallowed, so this one has to raise too.
          raise ActiveRecord::Rollback unless save_events_form

          interval.update!(close_out_completed_at: finalized_at)
          update!(effective_at: finalized_at)
        end

        errors.none?
      end

      # Stores where the unapplied total will go (a create event in the
      # upcoming month), or clears it with nil. Nothing is applied here.
      def update_unapplied_target_event(event)
        return clear_unapplied_target_event if event.nil?

        target = event.to_h.stringify_keys.slice(*UNAPPLIED_TARGET_ATTRIBUTES)
        category = active_category(target["budget_category_key"])
        error = unapplied_target_error(category)
        if error
          errors.add(:unapplied_target_event, error)
          return false
        end

        target.merge!(unapplied_target_details(category))
        update(
          events_data: stored_data.merge("unapplied_target_event" => target)
        )
      end

      def clear_unapplied_target_event
        update(events_data: stored_data.except("unapplied_target_event"))
      end

      def update_review_item(slug:, item_key:, **changes)
        changes.assert_valid_keys(:adjustment, :event_key)

        data = stored_data
        next_categories = data.fetch("categories").map do |category_data|
          next category_data unless category_data["slug"] == slug

          rebuild_category(category_data, item_key, changes.stringify_keys)
        end

        update(events_data: data.merge("categories" => next_categories))
      end

      private

      def stored_data = (events_data || {}).deep_stringify_keys

      def finalizable?
        error =
          if effective_at.present? || interval.closed_out?
            "this month has already been rolled over"
          elsif !data_model.submittable?
            "review every category and choose where the remainder goes"
          elsif events_reducer.missing_item_keys?
            "the review data is out of date; reset the rollover"
          end

        errors.add(:base, error) if error
        error.nil?
      end

      def save_events_form
        form = events_form
        return true if form.save

        form.errors.full_messages.each { |message| errors.add(:base, message) }
        false
      end

      def active_category(category_key)
        interval
          .user_group
          .budget_categories
          .active
          .find_by(key: category_key)
      end

      # The category has to belong to this budget, be active, and be the kind
      # the unapplied total can go to: an expense when it's negative, a
      # revenue when it's positive.
      def unapplied_target_error(category)
        total = data_model.unapplied_total

        if category.nil?
          "category not found"
        elsif total.zero?
          "nothing left to apply"
        elsif category.expense? != total.negative?
          "must be #{total.negative? ? 'an expense' : 'a revenue'} category"
        end
      end

      # The kind is kept so the target can be re-checked against the total
      # later, and the month is always the upcoming one.
      def unapplied_target_details(category)
        upcoming = interval.next

        {
          "is_expense" => category.expense?,
          "month" => upcoming.month,
          "year" => upcoming.year,
        }
      end

      def rebuild_category(category_data, item_key, changes)
        items = category_data.fetch("items").map do |item|
          item["key"] == item_key ? item.merge(changes) : item
        end

        Query::Result::Complex
          .from_data(category_data.merge("items" => items))
          .to_h
      end
    end
  end
end
