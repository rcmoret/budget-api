class SerializableCollection < Array
  def initialize(serializer:)
    super()
    yield.map { |item| self << serializer.new(item) }
  end

  def render(camelize: :lower)
    map { |item| item.render(camelize: camelize) }
  end
end
