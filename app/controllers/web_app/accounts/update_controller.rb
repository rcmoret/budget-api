# frozen_string_literal: true

module WebApp
  module Accounts
    class UpdateController < BaseController
      include Mixins::HasRedirectParams
      before_action -> { redirect_to accounts_manage_path },
        if: -> { account.nil? }
      before_action :set_update_intent
      before_action :set_archived_at!

      def call
        if account.update(update_params)
          set_success_message!
          redirect_to redirect_path
        else
          redirect_to accounts_manage_path
        end
      end

      private

      def account
        @account ||=
          Account.fetch(current_user_profile, key: params.fetch(:key))
      end

      def set_archived_at!
        archived_at = archive_param ? Time.current : nil

        return if archived_at && account.archived_at.present?

        account.assign_attributes(archived_at:)
      end

      def archive_param
        ActiveRecord::Type::Boolean.new.cast(
          params.require(:account)[:is_archived]
        )
      end

      def update_params
        params
          .require(:account)
          .permit(
            :name,
            :priority,
            :slug,
            :cash_flow
          )
      end

      def set_success_message!
        case @update_intent
        in { archiving: true, archived?: false, ** }
          flash[:warning] = "#{account.name} archived."
        in { archived?: true, archiving: false }
          flash[:notice] = "#{account.name} archived."
        else
          message_segments = [ "#{account.name} updated" ]
          if changed_attributes.any?
            message_segments << "(#{changed_attributes.join(', ')})"
          end
          flash[:notice] = "#{message_segments.join(' ')}."
          flash[:account_key] = { account.key => "updated" }
        end
      end

      def set_update_intent
        @update_intent = {
          archiving: params.require(:account)[:is_archived],
          archived?: account.archived?,
          original_attributes: account.attributes.slice(*update_params.keys),
        }
      end

      def changed_attributes
        (@update_intent || {})
          .fetch(:original_attributes)
          .reduce([]) do |memo, (key, value)|
            next memo if account.attributes[key] == value

            memo << key.humanize(capitalize: false)
          end
      end
    end
  end
end
