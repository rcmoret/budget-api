# frozen_string_literal: true

module WebApp
  module Accounts
    module Transfers
      class CreateController < BaseController
        include Mixins::HasRedirectParams

        def call
          case form.call
          in [:ok, *]
            redirect_to redirect_path
          in [:errors, error_hash]
            @errors = error_hash
            render inertia: "accounts/show", props: page_props
          end
        end

        private

        attr_accessor :errors

        def form
          Forms::TransferForm.new(
            user: current_user_profile,
            params: form_params
          )
        end

        def props = {}

        def namespace
          "accounts"
        end

        def form_params
          params
            .require(:transfer)
            .permit(:to_account_key, :from_account_key, :amount)
        end
      end
    end
  end
end
