module Budget
  module Categories
    class SummaryResource
      include Alba::Resource

      attributes :month,
        :year,
        :budgeted,
        :currently_budgeted,
        :previously_budgeted,
        :transactions_total

      transform_keys :lower_camel
    end
  end
end
