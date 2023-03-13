module Forms
  class TransactionForm
    include ActiveModel::Model

    PERMITTED_PARAMS = [
      :accountSlug,
      :budgetExclusion,
      :checkNumber,
      :clearanceDate,
      :description,
      :key,
      :notes,
      :receipt,
      { detailsAttributes: %i[key amount budgetItemKey _destroy].freeze }.freeze,
    ].freeze

    validate :account_belongs_to_user!

    def initialize(user, transaction_entry, raw_params)
      @user = user
      @transaction_entry = transaction_entry
      @initial_parameters = handle_input(raw_params)
    end

    def save
      transaction_entry.assign_attributes(parameters)

      return false unless valid?

      transaction_entry.save
    end

    delegate :slug, to: :account, prefix: true

    private

    def parameters
      @parameters ||= initial_parameters.reduce({}) do |memo, (key, value)|
        memo.merge(handle_attribute(key, value))
      end
    end

    def handle_attribute(key, value)
      return {} if value.blank?

      case key
      when :account_slug
        { account: Account.fetch(user: user, identifier: value) }
      when :details_attributes
        { details_attributes: value.values.map { |detail_attrs| handle_detail(detail_attrs) } }
      else
        { key => value }
      end
    end

    def handle_detail(detail_attrs)
      detail_id = transaction_entry.details.for(detail_attrs.fetch(:key))&.id
      budget_item_id = Budget::Item.fetch(user: user, identifier: detail_attrs.delete(:budget_item_key))&.id
      detail_attrs.merge(budget_item_id: budget_item_id, id: detail_id)
    end

    def handle_input(raw_params)
      raw_params
        .require(:transaction)
        .permit(*PERMITTED_PARAMS)
        .to_h
        .deep_transform_keys(&:underscore)
        .deep_symbolize_keys
    end

    def account_belongs_to_user!
      return if Account.belonging_to(user).exists?(account_id)

      errors.add(:account, "not found")
    end

    delegate :account, :account_id, to: :transaction_entry

    attr_reader :user, :initial_parameters, :transaction_entry
  end
end
