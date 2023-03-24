class SerializableCollection < Array
  def initialize(serializer:, **args)
    super()
    yield.map { |item| self << serializer.new(item, **args) }
  end

  def render(camelize: :lower)
    map { |item| item.render(camelize: camelize) }
  end
end
