module UsesTransactionEntryForm
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

  private

  def transaction_form
    @transaction_form ||= Forms::TransactionForm.new(api_user, transaction_entry, form_parameters)
  end

  def serializer
    API::Transactions::ResponseSerializer.new(
      accounts: accounts,
      transactions: [transaction_entry],
      interval: interval,
      budget_items: budget_items,
    )
  end

  def error_serializer
    @error_serializer ||= ErrorsSerializer.new(
      key: :transaction,
      model: transaction_form,
    )
  end

  def permitted_parameters
    transaction_entry_permitted_params << { details_attributes: transaction_details_permitted_params }
  end

  def formatted_params
    params
      .require(:transaction)
      .permit(*permitted_parameters)
      .to_h
      .deep_transform_keys(&:underscore)
      .deep_symbolize_keys
  end

  def form_parameters
    @form_parameters ||= formatted_params.reduce({}) do |memo, (key, value)|
      memo.merge(handle_attribute(key, value))
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def handle_attribute(key, value)
    case [key, value]
    in [:account_key, *]
      value.blank? ? {} : { account: Account.fetch(api_user, key: value) }
    in [:details_attributes, *]
      { details_attributes: value.map { |detail_attrs| handle_detail(detail_attrs) } }
    in [^key, String => string]
      string.blank? ? { key => nil } : { key => string.strip }
    in [^key, ^value]
      { key => value }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def handle_detail(detail_attrs)
    detail_id = transaction_entry.details.by_key(detail_attrs.fetch(:key))&.id
    budget_item = budget_item_look_up(detail_attrs.delete(:budget_item_key))
    detail_attrs.merge(id: detail_id, budget_item: budget_item)
  end

  def budget_item_keys
    details_attributes.filter_map do |parameters|
      parameters.fetch(:budget_item)&.key
    end
  end

  def budget_item_look_up(budget_item_key)
    return if budget_item_key.nil?

    Budget::Item.fetch(api_user, key: budget_item_key)
  end

  def details_attributes
    @details_attributes ||= form_parameters.fetch(:details_attributes) { [] }
  end

  def budget_items
    interval
      .items
      .fetch_collection(api_user, keys: budget_item_keys)
      .map(&:decorated)
  end
end
