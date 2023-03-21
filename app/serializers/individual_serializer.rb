class IndividualSerializer
  def initialize(key:, serializeable:)
    @key = key
    @serializeable = serializeable
  end

  def render(camelize: :lower)
    hash = { key => serializeable.render(camelize: camelize) }

    return hash unless camelize

    hash.transform_keys { |key| key.to_s.camelize(camelize) }
  end

  private

  attr_reader :key, :serializeable
end
