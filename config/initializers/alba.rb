Alba.inflector = :active_support

Alba.register_type :money,
  check: false, # always run the converter
  converter: ->(m) { Serializers::MoneySerializer.new(m).to_h },
  auto_convert: true
