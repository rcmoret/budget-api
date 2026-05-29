# frozen_string_literal: true

module Presenters
  module WebApp
    module FlashMessagesConcern
      def flash
        @flash ||= {}
      end

      def flash=(value)
        @flash = value
      end

      def alerts
        Array.wrap(flash[:alert])
      end

      def info
        Array.wrap(flash[:info])
      end

      def notices
        Array.wrap(flash[:notice])
      end

      def warnings
        Array.wrap(flash[:warning])
      end
    end
  end
end
