# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class IndexSerializer < ApplicationSerializer
        IconSerializer = Class.new(ApplicationSerializer) do
          attributes :key, :name, :class_name
        end
        private_constant :IconSerializer

        def initialize(current_user_profile, &block)
          super(block.call)
          @current_user_profile = current_user_profile
        end

        attribute :categories, on_render: :render
        attribute :icons, on_render: :render

        def icons
          SerializableCollection.new(serializer: IconSerializer) do
            Icon.all
          end
        end

        def categories
          SerializableCollection.new(serializer: CategorySerializer,
            current_user_profile:) do
            __getobj__
          end
        end

        private

        attr_reader :current_user_profile
      end
    end
  end
end
