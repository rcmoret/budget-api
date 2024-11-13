import { moneyFormatter, decimalToInt } from "./MoneyFormatter";

it("returns a negative number prefixed with dollar sign with commas in the thousands place ", () => {
  const actual = moneyFormatter(-100345, {
    decorate: true,
  });
  expect(actual).toEqual("$-1,003.45");
});

it("returns a positive number prefixed with a dollar sign and commas in the thousands place", () => {
  const actual = moneyFormatter(100345, {
    decorate: true,
  });
  expect(actual).toEqual("$1,003.45");
});

it("returns a positive number prefixed with a dollar sign and commas in the millions place", () => {
  const actual = moneyFormatter(103450000, {
    decorate: true,
  });
  expect(actual).toEqual("$1,034,500.00");
});

it("always returns an positive number if the 'abosolute' flag is set to true", () => {
  const actual = moneyFormatter(-21533, {
    absolute: true,
    decorate: true,
  });
  expect(actual).toEqual("$215.33");
});

it("returns a float if the 'toFloat' flag is set to true for a negative number", () => {
  const actual = moneyFormatter(-100345);
  expect(actual).toEqual("-1003.45");
});

it("returns a float if the 'toFloat' flag and and absolute flags are set to true", () => {
  const actual = moneyFormatter(-100345, {
    absolute: true,
  });
  expect(actual).toEqual("1003.45");
});

it("returns a integer mulitplied by 100", () => {
  const actual = decimalToInt("2.3");
  expect(actual).toEqual(230);
});

it("returns a integer mulitplied by 100", () => {
  const actual = decimalToInt("2.30");
  expect(actual).toEqual(230);
});
