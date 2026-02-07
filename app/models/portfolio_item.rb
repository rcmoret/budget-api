class PortfolioItem < ApplicationRecord
  include HasKeyIdentifier

  has_one_attached :image

  belongs_to :profile, class_name: "User::Profile", foreign_key: :user_profile_id, inverse_of: :portfolio_items

  validates :image,
            content_type: {
              in: %w[image/png image/jpeg application/pdf],
              message: "must be a PNG, JPG, or PDF file",
            },
            size: {
              less_than: 10.megabytes,
              message: "must be less than 10MB",
            },
            if: -> { image.attached? }
end
