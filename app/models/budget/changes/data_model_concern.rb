module Budget
  module Changes
    module DataModelConcern
      extend ActiveSupport::Concern

      included do
        attr_reader :change, :categories

        attr_accessor :slug
      end

      def with(slug:)
        @slug = slug
        self
      end

      def slugs
        categories.map(&:slug)
      end

      delegate :find, to: :categories

      def category
        if slug.blank?
          categories.first
        else
          find { |category| category.slug == slug } || categories.first
        end
      end
    end
  end
end
