# frozen_string_literal: true

module WebApp
  module Transactions
    class UpdateController < BaseController
      include Mixins::HasRedirectParams
      include Mixins::HasBudgetInterval
      include Mixins::HasAccount

      DEFAULT_TRANSACTION_ENTRY_PERMITTED_PARAMS = %i[
        is_budget_exclusion
        check_number
        clearance_date
        description
        notes
        receipt
      ].freeze

      DEFAULT_TRANSACTION_DETAIL_PARAMS = %i[
        key
        amount
        budget_item_key
      ].freeze

      before_action -> { redirect_to(home_path) }, if: -> { transaction.nil? }

      def call
        if transaction_form.save
          redirect_to(redirect_path)
        else
          render json: transaction.errors
        end
      end

      private

      def transaction_form
        @transaction_form ||= Forms::TransactionForm.new(current_user_profile, transaction, form_parameters)
      end

      def transaction
        @transaction ||= account.transactions.by_key(params[:key])
      end

      def transaction_entry_permitted_params
        DEFAULT_TRANSACTION_ENTRY_PERMITTED_PARAMS.dup + %i[account_key]
      end

      def transaction_details_permitted_params
        DEFAULT_TRANSACTION_DETAIL_PARAMS.dup + %i[_destroy]
      end

      def permitted_parameters
        transaction_entry_permitted_params << { details_attributes: transaction_details_permitted_params }
      end

      def formatted_params
        params
          .require(:transaction)
          .permit(*permitted_parameters)
          .to_h
      end

      def form_parameters
        @form_parameters ||= formatted_params.reduce({}) do |memo, (key, value)|
          memo.merge(handle_attribute(key, value))
        end
      end

      # rubocop:disable Metrics/CyclomaticComplexity
      def handle_attribute(key, value)
        case [key, value]
        in ["account_key", *]
          value.blank? ? {} : { account: Account.fetch(current_user_profile, key: value) }
        in ["details_attributes", *]
          { details_attributes: value.map { |detail_attrs| handle_detail(detail_attrs) } }
        in [^key, String => string]
          string.blank? ? { key => nil } : { key => string.strip }
        in [^key, ^value]
          { key => value }
        end
      end
      # rubocop:enable Metrics/CyclomaticComplexity

      def handle_detail(detail_attrs)
        detail_id = transaction.details.by_key(detail_attrs.fetch("key"))&.id
        budget_item = budget_item_look_up(detail_attrs.delete("budget_item_key"))
        detail_attrs.merge(id: detail_id, budget_item: budget_item)
      end

      def budget_item_look_up(budget_item_key)
        return if budget_item_key.nil?

        ::Budget::Item.fetch(current_user_profile, key: budget_item_key)
      end

      def namespace = "accounts"
    end
  end
end
