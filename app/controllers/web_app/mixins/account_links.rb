# frozen_string_literal: true

module WebApp
  module Mixins
    module AccountLinks
      extend ActiveSupport::Concern

      # this is from app/lib/presenters/transactions/index_presenter.rb
      # I want to make a struct that captures
      # name,
      # slug (as "to_param")
      # balance
      #
      # def accounts
      #   @accounts ||=
      #     Account
      #     .belonging_to(user_profile)
      #     .active
      #     .by_priority
      #     .with_balance
      # end
    end
  end
end
