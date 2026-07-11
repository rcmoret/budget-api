# frozen_string_literal: true

module WebApp
  # Shared behavior for controllers that render a full Inertia page.
  #
  # Including this concern turns a controller into a "page" endpoint: its
  # `call` action renders the Inertia component set by `use_template`, passing
  # the hash produced by the page's serializer as the props.
  #
  # A page controller is configured declaratively with class macros rather
  # than by overriding methods:
  #
  #   - `serialize_with`          — the PageSerializer subclass to render with
  #   - `use_template`            — the Inertia component path to render
  #   - `subject`                 — block (evaluated on the controller instance)
  #                                 yielding the object to serialize; an
  #                                 optional key nests it under that key
  #   - `define_route_segment(s)` — static segments identifying this page
  #
  # Two instance methods may be overridden to supply request-time data:
  #
  #   - `serializer_context` — extra params merged into the serializer params
  #   - `route_segments`     — append dynamic segments (call `super`)
  #
  # @example
  #   class IndexController < BaseController
  #     include Mixins::PageController
  #
  #     define_route_segment :budget
  #     use_template "budget/dashboard"
  #     serialize_with WebApp::Budget::Dashboard::Serializer
  #     subject { Presenters::Budget::Dashboard::IndexPresenter.new(interval) }
  #
  #     private
  #
  #     def serializer_context = { month:, year: }
  #     def route_segments = super(month, year)
  #   end
  module Mixins
    module PageController
      extend ActiveSupport::Concern

      class_methods do
        # Per-controller configuration set by the macros below.
        attr_accessor :page_name,
          :route_segments,
          :serializable,
          :serializer_class,
          :subject_key

        # Sets the Inertia component path this page renders (e.g.
        # "budget/dashboard").
        # This is also used for the metadata in the payload
        def use_template(name)
          self.page_name = name
        end

        # Defines the serializer to use for the subject
        def serialize_with(serializer_class)
          self.serializer_class = serializer_class
        end

        # The static route segments declared for this controller, defaulting
        # to an empty list. The instance-level `route_segments` reads from here.
        def route_segments
          @route_segments ||= []
        end

        # Appends static segments identifying this page (flattened, so it
        # accepts either multiple args or an array). Aliased as
        # `define_route_segment` for the single-segment reading.
        def define_route_segments(*segments)
          self.route_segments += segments.flatten
        end

        # Define the serializable object. The block will be
        # evaluated in a per instance context
        def subject(key = nil, &block)
          self.subject_key = key
          self.serializable = block
        end

        alias_method :define_route_segment, :define_route_segments
      end

      # Renders the Inertia response for this page: the `page_name` component
      # receives the serialized props hash. This is the controller's action.
      def call
        render inertia: page_name, props:
      end

      private

      delegate :page_name, :serializer_class, :subject_key, to: :class

      def props
        if subject_key.present?
          {
            subject_key => serializer.to_h,
            pageData: page_serializer.to_h,
          }
        else
          serializer.to_h.merge(pageData: page_serializer.to_h)
        end
      end

      def serializer
        serializer_class.new(subject, params: serializer_context)
      end

      def subject
        instance_eval(&self.class.serializable)
      end

      # Route segments identifying this page, used by the frontend to build a
      # "redirect back here" link after an action elsewhere. Combines the
      # static segments declared via `define_route_segment(s)` with any
      # `additional_segments` passed at call time (e.g. a dynamic record slug);
      # blanks are dropped. Controllers override this to append dynamic
      # segments, calling `super(...)`.
      #
      # @param additional_segments [Array] extra trailing segments to append
      # @return [Array] the ordered route segments
      def route_segments(*additional_segments)
        [
          *self.class.route_segments,
          *additional_segments,
        ].compact_blank
      end

      def serializer_context = {}

      # additional data to be passed to all pages
      def page_serializer
        Serializers::PageSerializer.new(page_data, params: serializer_context)
      end

      def page_data
        Pages::Presenters::ApplicationPresenter.with(
          current_path: request.path,
          flash:,
          page_name:,
          prev_selected_account_path:,
          redirect_segments: route_segments,
        )
      end
    end
  end
end
