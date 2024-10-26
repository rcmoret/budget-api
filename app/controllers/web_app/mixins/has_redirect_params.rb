# frozen_string_literal: true

module WebApp
  module Mixins
    module HasRedirectParams
      InvalidPathError = Class.new(StandardError)

      # rubocop:disable Metrics/MethodLength
      def redirect_path
        case redirect_params
        in ["budget", *rest]
          resolve_budget_path(*rest)
        in ["accounts", *]
          accounts_index_path
        in ["account", *rest]
          resolve_account_path(*rest)
        else
          home_path
        end
      rescue InvalidPathError, NoMatchingPatternError => e
        Rails.logger.error(e)
        home_path
      end

      def resolve_budget_path(*args)
        case args
        in [month, year, *]
          raise InvalidPathError unless (1..12).cover?(month.to_i)
          raise InvalidPathError unless year =~ /\A\d{4}\z/

          budget_index_path(month, year)
        in ["categories"]
          budget_categories_index_path
        in [*]
          budget_index_path
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
    end
  end
end