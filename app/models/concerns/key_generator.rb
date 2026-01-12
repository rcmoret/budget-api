# frozen_string_literal: true

module KeyGenerator
  def self.call
    SecureRandom.hex(6)
  end
end
