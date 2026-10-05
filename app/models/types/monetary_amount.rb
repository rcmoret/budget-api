module Types
  class MonetaryAmount < ActiveRecord::Type::Value
    def cast(*args)
      case args.compact_blank
      in [ Money => money ]
        money
      in [ Integer => number ]
        Money.from_cents(number)
      in [ { cents:, ** } ]
        Money.from_cents(cents.to_i)
      in [ { display:, ** } ]
        Monetize.parse(display)
      else
        Serializers::NullMoney.new
      end
    end
  end
end
