# frozen_string_literal: true

module Presenters
  module Budget
    module Categories
      class CollectionPresenter
        include Presenters::WebApp::FlashMessagesConcern

        def initialize(
          user_profile,
          categories_scope = ::Budget::Category.all,
          metadata:
        )
          @user_profile = user_profile
          @categories_scope = categories_scope
          @metadata = metadata
        end

        attr_reader :user_profile, :categories_scope, :flash, :metadata

        def categories
          @categories ||=
            categories_scope
            .includes(:icon, maturity_intervals: :interval)
            .belonging_to(user_profile)
            .order(:name)
            .to_a
        end
      end
    end
  end
end
