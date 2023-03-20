class ErrorsSerializer < SimpleDelegator
  def initialize(key:, model:)
    super(model)
    @key = key
  end

  def render(camelize: :lower)
    hash = { key => errors.to_hash }

    return hash unless camelize

    hash.deep_transform_keys { |key| key.to_s.camelize(camelize) }
  end

  private

  attr_reader :model, :key
end
