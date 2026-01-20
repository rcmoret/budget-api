module NumericStringToCents
  CentsStruct = Data.define(:string) do
    def to_s = string

    def negative?
      string.starts_with?("-")
    end

    def to_i
      if negative?
        abs * -1
      else
        abs
      end
    end

    def abs
      dollars, cents =
        string
        .gsub(/[^\d\.]/, "")
        .split(".")
        .compact_blank
        .first(2)

      (dollars.to_i * 100) + cents.to_s.ljust(2, "0").slice(0, 2).to_i
    end

    def valid?
      string.match?(/\A-?\d*(\.\d{0,2})?\z/)
    end
  end

  def numeric_string_to_cents(string)
    CentsStruct.new(string.to_s.gsub(/\s/, ""))
  end
end
