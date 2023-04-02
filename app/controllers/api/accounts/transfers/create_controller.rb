module API
  module Accounts
    module Transfers
      class CreateController < BaseController
        include HasBudgetInterval

        def call
          case result
          in [:ok, serializer]
            render json: serializer.render, status: :created
          in [:not_found, errors]
            render json: errors, status: :not_found
          in [:error, errors]
            render json: errors, status: :unprocessable_entity
          end
        end

        private

        # rubocop:disable Metrics/MethodLength
        def result
          case transfer_form.call
          in [:ok, success_body]
            [
              :ok,
              ::Transactions::ResponseSerializer.new(
                accounts: success_body.values_at(:from_account, :to_account),
                transactions: success_body.values_at(:from_transaction, :to_transaction),
                interval: interval,
              ),
            ]
          in [:error, body]
            if body.values.flatten.include?("can't be blank")
              [:not_found, body]
            else
              [:error, body]
            end
          end
        end
        # rubocop:enable Metrics/MethodLength


        def transfer_form
          @transfer_form ||= Forms::TransferForm.new(
            user: api_user,
            params: transfer_params,
          )
        end

        def transfer_params
          params
            .require(:transfer)
            .permit(
              :key,
              :amount,
              :from_account_key,
              :to_account_key,
            )
        end

        attr_accessor :serializer
      end
    end
  end
end
