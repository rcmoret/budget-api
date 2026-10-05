module Types
  class BudgetCategory < ActiveRecord::Type::Json
    ATTRIBUTE_NAMES = Budget::Category.attribute_names

    def cast(args)
      props = args.each_with_object({}) do |(key, value), memo|
        key = key.to_s.sub(/\A(budget_category_|is_)/, "")

        next unless ATTRIBUTE_NAMES.include?(key)

        memo[key] = value
      end

      Budget::Category.new(props)
    end
  end
end
