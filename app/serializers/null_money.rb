module Serializers
  class NullMoney < Money
    def initialize(...)
      super(0)
    end

    def format(...) = ""

    def +(other)
      other
    end

    def -(other)
      other * -1
    end

    def *(*)
      self
    end

    def /(*)
      self
    end
  end
end
