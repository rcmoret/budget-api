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

      # Base class every page serializer must inherit from; enforced by
      # `serialize_with`.
      PAGE_SERIALIZER = PageSerializer

      # Raised when `serialize_with` is given a class that isn't a
      # `PAGE_SERIALIZER` descendant.
      PageSerializableError = Class.new(StandardError)

      class_methods do
        # Per-controller configuration set by the macros below.
        attr_accessor :route_segments,
          :page_name,
          :page_subject,
          :serializer,
          :subject_key

        # Registers the serializer used to render this page. The class must
        # descend from `PAGE_SERIALIZER`, otherwise `PageSerializableError` is
        # raised at load time.
        def serialize_with(klass)
          if klass.is_a?(Class) && klass.ancestors.include?(PAGE_SERIALIZER)
            self.serializer = klass
          else
            raise PageSerializableError,
              "#{klass} must inherit from #{PAGE_SERIALIZER.name}"
          end
        end

        # Sets the Inertia component path this page renders (e.g.
        # "budget/dashboard").
        # This is also used for the metadata in the payload
        def use_template(name)
          self.page_name = name
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

        # Declares the object to serialize. The block is evaluated on the
        # controller instance at request time (see the instance `subject`).
        # When `key` is given, the evaluated value is nested under it.
        def subject(key = nil, &block)
          self.subject_key = key
          self.page_subject = block
        end

        alias_method :define_route_segment, :define_route_segments
      end

      # Renders the Inertia response for this page: the `page_name` component
      # receives the serialized props hash. This is the controller's action.
      def call
        render inertia: page_name,
          props: serializer.to_h
      end

      private

      delegate :page_name, :page_subject, :subject_key, to: :class

      # The serializer class registered via `serialize_with`.
      def serializer_class
        self.class.serializer
      end

      # Builds the page's serializer around `subject`, injecting the params
      # every page serializer relies on (request path, flash, page name, the
      # previously selected account path, and route segments). The controller's
      # `serializer_context` is merged in last, so it can override any of these
      # defaults.
      def serializer
        serializer_class
          .new(
            subject,
            params: {
              current_path: request.path,
              flash:,
              page_name:,
              prev_selected_account_path:,
              redirect_segments: route_segments,
            }.merge(serializer_context)
          )
      end

      # Extra params merged into the serializer params. Override in the
      # controller to pass request-time data (e.g. the current month/year).
      def serializer_context = {}

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

      # Resolves the object to serialize by evaluating the `subject` block on
      # this controller instance. When a `subject_key` was given, the result is
      # wrapped in a hash under that key.
      def subject
        evaluated_subject = instance_eval(&page_subject)

        return evaluated_subject if subject_key.blank?

        { subject_key => evaluated_subject }
      end
    end
  end
end
