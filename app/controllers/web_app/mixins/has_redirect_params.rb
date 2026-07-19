# frozen_string_literal: true

module WebApp
  module Mixins
    module HasRedirectParams
      InvalidPathError = Class.new(StandardError)

      BudgetRoutingMatcher = Class.new do
        include Rails.application.routes.url_helpers

        def self.call(*args)
          new.call(*args)
        end

        def call(*args)
          case args
          in []
            budget_dashboard_path
          in ["categories", *rest]
            budget_categories_path(*rest)
          in [month, year, *rest]
            raise InvalidPathError unless (1..12).cover?(month.to_i)
            raise InvalidPathError unless year =~ /\A\d{4}\z/

            resolve_budget_path(month, year, *rest)
          end
        rescue InvalidPathError
          budget_dashboard_path
        end

        def resolve_budget_path(month, year, *args)
          case args
          in ["set-up", slug]
            budget_setup_form_path(month, year, slug)
          in ["set-up"]
            budget_setup_form_path(month, year)
          in []
            budget_dashboard_path(month, year)
          end
        end
      end

      def redirect_path
        case redirect_params
        in ["budget", *rest]
          BudgetRoutingMatcher.call(*rest)
        in ["accounts", "manage"]
          accounts_path
        in ["account", *rest]
          resolve_account_path(*rest)
        else
          dashboard_path
        end
      rescue InvalidPathError, NoMatchingPatternError => e
        Rails.logger.error(e)
        dashboard_path
      end

      def resolve_account_path(*args)
        case args
        in [slug, "transactions", *rest]
          resolve_transactions_path(slug, *rest)
        in ["edit", slug, *rest]
          account_edit_path(slug, *rest)
        else
          accounts_path
        end
      end

      def resolve_transactions_path(slug, *args)
        unless Account.belonging_to(current_user_profile).exists?(slug:)
          return accounts_path
        end

        case args
        in [month, year, *]
          raise InvalidPathError unless (1..12).cover?(month.to_i)
          raise InvalidPathError unless year =~ /\A\d{4}\z/

          transactions_path(slug, month, year)
        else
          transactions_path(slug)
        end
      rescue InvalidPathError
        transactions_path(slug)
      end

      def redirect_params
        params.require(:redirect).permit(segments: [])[:segments]
      end
    end
  end
end
