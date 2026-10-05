module Serializers
  class MoneySerializer
    include Alba::Resource

    def initialize(*args)
      case MoneyConcern.normalize_args(args).compact_blank
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
      end.then { super(_1) }
    end

    attributes :cents
    attribute :display do |monetary_amount|
      monetary_amount.format(symbol: false, thousands_separator: "")
    end
  end
end
