module WebApp
  module Serializers
    module Budget
      module Interval
        # DEPRECATED: This serializer was built on the hand-rolled
        # ApplicationSerializer and is no longer wired up to a live endpoint.
        # It has been neutered while we migrate serialization to Alba.
        #
        # TODO: Revisit and reimplement as an Alba::Resource (see the ported
        # transactions serializers for the target pattern), then restore the
        # controller wiring in WebApp::Budget::EditController.
        class DraftSerializer
          def initialize(*)
            raise NotImplementedError,
              "#{self.class} is deprecated and pending reimplementation with Alba"
          end

          # attribute :discretionary, on_render: :render
          # attribute :items, on_render: :render
          #
          # def initialize(interval, changes:)
          #   @changes = changes.map { |change| ::Budget::DraftItem.new(change) }
          #   super(interval)
          # end
          #
          # def discretionary
          #   DraftDiscretionarySerializer.new(interval, items: all_items)
          # end
          #
          # def items
          #   SerializableCollection.new(serializer: LocalItemSerializer) do
          #     changes
          #   end
          # end
          #
          # private
          #
          # attr_reader :changes
          #
          # def interval
          #   __getobj__
          # end
          #
          # def all_items
          #   interval.items.map do |item|
          #     changes.find { |change| change.key == item.key } || item.decorated
          #   end
          # end
          #
          # class LocalItemSerializer < ApplicationSerializer
          #   attributes :key,
          #     :budget_category_key,
          #     :budget_category_name,
          #     :icon_class_name,
          #     :name,
          #     :amount,
          #     :difference,
          #     :remaining,
          #     :spent
          #   attribute :is_new_item, alias_of: :new_record?
          #   attribute :is_monthly, alias_of: :monthly?
          #
          #   delegate :icon_class_name, to: :category
          #
          #   def budget_category_name
          #     category.name
          #   end
          #
          #   def budget_category_key
          #     category.key
          #   end
          # end
        end
      end
    end
  end
end
