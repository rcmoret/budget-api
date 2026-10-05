module Serializers
  module MoneyConcern
    extend ActiveSupport::Concern

    module ClassMethods
      def null_money = Serializers::NullMoney.new

      def monetary_attributes(*named_attributes)
        named_attributes.each do |attr|
          register_monetary_attribute(attr)
        end
      end

      def register_monetary_attribute(named_attribute)
        attributes(named_attribute => :money)

        define_method named_attribute do |*|
          case object
          when Hash
            cast(object.fetch(named_attribute, 0))
          else
            cast(object.send(named_attribute))
          end
        end
      end
    end

    def null_money = Serializers::NullMoney.new

    def cast(*args)
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
      end
    end

    # Hash keys may be strings (e.g. stored JSON). A blank display is how
    # NullMoney serializes, so it's dropped and falls through to NullMoney.
    def self.normalize_args(args)
      args.filter_map do |arg|
        next arg unless arg.is_a?(Hash)

        arg.symbolize_keys.then { |hash| hash unless hash[:display] == "" }
      end
    end
  end
end
