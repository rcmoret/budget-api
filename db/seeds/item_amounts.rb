ITEM_AMOUNTS = {
  "car-ins" => {
    "base" => -80_00,
    "future" => -80_00,
  },
  "cell-phone" => {
    "base" => -> { (200..230).to_a.sample * -100 },
    "future" => -> { (200..230).to_a.sample * -100 },
  },
  "change" => {
    "base" => 12_00,
  },
  "cleaning" => {
    "base" => -31_00,
    "future" => -31_00,
  },
  "electric-bill" => {
    "base" => -77_60,
    "future" => -77_60,
  },
  "gas" => {
    "base" => -> { (90..110).to_a.sample * -100 },
    "future" => -> { (90..110).to_a.sample * -100 },
  },
  "groceries" => {
    "base" => -> { (600..700).to_a.sample * -100 },
    "future" => -> { (600..700).to_a.sample * -100 },
  },
  "misc-income" => {
    "base" => -> { (100..150).to_a.sample * 100 },
    "future" => -> { (100..150).to_a.sample * 100 },
  },
  "mortgage" => {
    "base" => -900_00,
    "future" => -900_00,
  },
  "salary" => [
    { "base" => 112_000, "key" => KeyGenerator.call },
    { "base" => 115_000, "key" => KeyGenerator.call },
    { "future" => 112_000, "key" => KeyGenerator.call },
    { "future" => 115_000, "key" => KeyGenerator.call },
  ],
}.freeze
