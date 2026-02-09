class SerializableCollection < Array
  def initialize(serializer: :none, **args)
    super()
    Array.wrap(yield).map do |item|
      object = serializer == :none ? item : serializer.new(item, **args)
      self << object
    end
  end

  def render(camelize: :lower)
    map { |item| item.render(camelize:) }
  end
end
