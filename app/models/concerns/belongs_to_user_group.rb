# frozen_string_literal: true

module BelongsToUserGroup
  extend ActiveSupport::Concern

  included do
    belongs_to :user_group, class_name: "User::Group"

    scope :belonging_to, lambda { |user_or_group|
      case user_or_group
      in User::Profile => user
        joins(:user_group).where(user_group: user.group)
      in User::Group => group
        joins(:user_group).where(user_group: group)
      end
    }
  end

  module Through
    def self.[](args)
      Module.new.tap do |through_module|
        module_args =
          case args
          in Symbol => association
            module_body(
              class_name: association.to_s.classify,
              association:
            )
          in { class_name: _, association: }
            module_body(**args)
          end
        through_module.module_eval(*module_args)
      end
    end

    # extend ActiveSupport::Concern

    # included do
    #   scope :belonging_to, lambda { |user_or_group|
    #     joins(:interval).merge(Interval.belonging_to(user_or_group))
    #   }
    # end

    # delegate :user_group, to: :interval
    def self.module_body(class_name:, association:)
      [
        <<-THROUGH, __FILE__, __LINE__ + 1,
          extend ActiveSupport::Concern

          included do
            scope :belonging_to, lambda { |user_or_group|
              joins(:#{association}).merge(#{class_name}.belonging_to(user_or_group))
            }
          end

          delegate :user_group, to: :#{association}
        THROUGH
      ]
    end
  end
end
