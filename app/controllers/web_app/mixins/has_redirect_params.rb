# frozen_string_literal: true

module WebApp
  module Mixins
    module HasRedirectParams
      InvalidPathError = Class.new(StandardError)

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/PerceivedComplexity
      # rubocop:disable Metrics/CyclomaticComplexity
      # rubocop:disable Metrics/AbcSize
      def redirect_path
        case redirect_params
        in ["budget"]
          budget_index_path
        in ["budget", "categories"]
          budget_categories_index_path
        in ["budget", "category", *rest]
          resolve_budget_category_path(*rest)
        in ["budget", month, year, *rest]
          raise InvalidPathError unless (1..12).cover?(month.to_i)
          raise InvalidPathError unless year =~ /\A\d{4}\z/

          resolve_budget_path(month, year, *rest)
        in ["accounts", "manage"]
          accounts_manage_path
        in ["accounts", *]
          accounts_index_path
        in ["account", *rest]
          resolve_account_path(*rest)
        else
          dashboard_path
        end
      rescue InvalidPathError, NoMatchingPatternError => e
        Rails.logger.error(e)
        dashboard_path
      end
      # rubocop:enable Metrics/PerceivedComplexity
      # rubocop:enable Metrics/CyclomaticComplexity
      # rubocop:enable Metrics/AbcSize

      def resolve_budget_path(month, year, *args)
        case args
        in ["set-up", *]
          budget_set_up_form_path(month, year)
        in []
          budget_index_path(month, year)
        end
      rescue InvalidPathError
        budget_index_path
      end

      def resolve_account_path(*args)
        case args
        in [slug, "transactions", *rest]
          resolve_transactions_path(slug, *rest)
        else
          accounts_index_path
        end
      end

      def resolve_transactions_path(slug, *args)
        return accounts_index_path unless Account.belonging_to(current_user_profile).exists?(slug: slug)

        case args
        in [month, year, *]
          raise InvalidPathError unless (1..12).cover?(month.to_i)
          raise InvalidPathError unless year =~ /\A\d{4}\z/

          transactions_index_path(slug, month, year)
        else
          transactions_index_path(slug)
        end
      rescue InvalidPathError
        transactions_index_path(slug)
      end
      # rubocop:enable Metrics/MethodLength

      def resolve_budget_category_path(*args)
        case args
        in [slug]
          budget_category_show_path(slug)
        else
          budget_categories_index_path
        end
      end

      def redirect_params
        params.require(:redirect).permit(segments: [])[:segments]
      end
    end
  end
end
