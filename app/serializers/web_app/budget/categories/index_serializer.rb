# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexSerializer < ApplicationSerializer
        IconSerializer = Class.new(ApplicationSerializer) do
          attributes :key, :name, :class_name
        end
        private_constant :IconSerializer

        def initialize(&block)
          super(block.call)
        end

        attribute :categories, alias_of: :__getobj__, each_serializer: ShowSerializer
        attribute :icons, on_render: :render

        def icons
          SerializableCollection.new(serializer: IconSerializer) do
            Icon.all
          end
        end
      end
    end
  end
end
