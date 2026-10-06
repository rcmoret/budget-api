module WebApp
  module Budget
    module Changes
      module Rollover
        module Query
          module Result
            class ItemToItemSerializer
              include ::Serializers::MoneyConcern
              include Alba::Resource

              DEFAULTS = {
                adjustment: null_money,
                target_item_budgeted: null_money,
                rollover: false,
              }.freeze

              def self.map(*args, **kw_args)
                if args.any?
                  args.map do |attrs|
                    new(attrs.reverse_merge(DEFAULTS)).to_h
                  end
                else
                  [ new(kw_args.compact.reverse_merge(DEFAULTS)).to_h ]
                end
              end

              attributes :key,
                :event_key,
                :event_type,
                updated_target_amount: :money,
                unapplied_amount: :money

              monetary_attributes :adjustment,
                :remaining,
                :target_item_budgeted

              attributes :is_valid
              attributes :is_reviewed

              def reviewed?(*)
                object[:event_key].present? &&
                  adjustment.format.present?
              end

              def updated_target_amount(*)
                adjustment + target_item_budgeted
              end

              def valid?(*)
                Range
                  .new(*[ Money.from_cents(0), remaining ].minmax)
                  .cover?(adjustment)
              end

              def unapplied_amount(*)
                return null_money unless reviewed?

                remaining - adjustment
              end

              def is_valid(*) = valid?
              def is_reviewed(*) = reviewed?
            end
          end
        end
      end
    end
  end
end
