module NumericStringToCents
  # rubocop:disable Metrics/AbcSize
  def self.call(string)
    dollars, cents = string.strip.split(".")
    case [dollars, cents]
    in [nil, nil]
      0
    in [/\A\d*\z/, /\A\d{2}\z/] | [/\A\d*\z/, nil]
      (dollars.to_i * 100) + cents.to_i
    in [/\A-\d*\z/, /\A\d{2}\z/] | [/\A-\d*\z/, nil]
      (dollars.to_i * 100) - cents.to_i
    in [/\A\d*\z/, /\A\d\z/]
      (dollars.to_i * 100) + (cents.to_i * 10)
    in [/\A-\d*\z/, /\A\d\z/]
      (dollars.to_i * 100) - (cents.to_i * 10)
    end
  end

  def numeric_string_to_cents(string)
    dollars, cents = string.strip.split(".")
    case [dollars, cents]
    in [nil, nil]
      0
    in [/\A\d*\z/, /\A\d{2}\z/] | [/\A\d*\z/, nil]
      (dollars.to_i * 100) + cents.to_i
    in [/\A-\d*\z/, /\A\d{2}\z/] | [/\A-\d*\z/, nil]
      (dollars.to_i * 100) - cents.to_i
    in [/\A\d*\z/, /\A\d\z/]
      (dollars.to_i * 100) + (cents.to_i * 10)
    in [/\A-\d*\z/, /\A\d\z/]
      (dollars.to_i * 100) - (cents.to_i * 10)
    end
  end
  # rubocop:enable Metrics/AbcSize
end
