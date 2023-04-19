class IndividualSerializer
  def initialize(key:, serializable:)
    @key = key
    @serializable = serializable
  end

  def render(camelize: :lower)
    hash = { key => serializable.render(camelize: camelize) }

    return hash unless camelize

    hash.transform_keys { |key| key.to_s.camelize(camelize) }
  end

  private

  attr_reader :key, :serializable
end
