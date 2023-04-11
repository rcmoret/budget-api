module UsesTransactionEntryForm
  DEFAULT_TRANSACTION_ENTRY_PERMITTED_PARAMS = %i[
    budgetExclusion
    checkNumber
    clearanceDate
    description
    notes
    receipt
  ].freeze

  DEFAULT_TRANSACTION_DETAIL_PARAMS = %i[
    key
    amount
    budgetItemKey
  ].freeze

  private

  def transaction_form
    @transaction_form ||= Forms::TransactionForm.new(api_user, transaction_entry, form_parameters)
  end

  def serializer
    Transactions::ResponseSerializer.new(
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
    transaction_entry_permitted_params << { detailsAttributes: transaction_details_permitted_params }
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

  def handle_attribute(key, value)
    return {} if value.blank?

    case key
    when :account_key
      { account: Account.fetch(user: api_user, key: value) }
    when :details_attributes
      { details_attributes: value.values.map { |detail_attrs| handle_detail(detail_attrs) } }
    else
      { key => value }
    end
  end

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

    Budget::Item.fetch(user: api_user, key: budget_item_key)
  end

  def details_attributes
    @details_attributes ||= form_parameters.fetch(:details_attributes) { [] }
  end

  def budget_items
    interval
      .items
      .fetch_collection(user: api_user, keys: budget_item_keys)
      .map(&:as_presenter)
  end
end
