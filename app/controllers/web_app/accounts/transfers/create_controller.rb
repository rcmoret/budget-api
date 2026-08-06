# frozen_string_literal: true

module WebApp
  module Accounts
    module Transfers
      class CreateController < BaseController
        include Mixins::HasRedirectParams

        def call
          case form.call
          in [:ok, *]
            redirect_to redirect_path, notice: "Transfer completed."
          in [:error, *]
            flash[:warning] = form.errors.full_messages.to_sentence
            redirect_to redirect_path
          end
        end

        private

        def form
          @form ||= Forms::TransferForm.new(
            user: current_user_profile,
            params: form_params
          )
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
