interface MoneyFormatterOptions {
  absolute?: boolean;
  decorate?: boolean;
}

const moneyFormatter = (
  number: number,
  opts?: MoneyFormatterOptions,
): string => {
  const options = {
    absolute: false,
    decorate: false,
    ...opts,
  };

  const num = options.absolute ? Math.abs(number) : number;
  if (options.decorate) {
    return (
      "$" + (num / 100.0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  } else {
    return (num / 100.0).toFixed(2);
  }
};

const decimalToInt = (amount: string): number => {
  const stringArray = `${amount.replace(/[^-0-9.]/g, "")}.`.split(".");
  const dollars = stringArray[0];
  const cents = stringArray[1];

  if (amount === "" || (cents.length == 0 && dollars === "-")) {
    return 0;
  } else if (cents.length == 0) {
    return parseInt(amount) * 100;
  } else if (cents.length == 2) {
    return parseInt(`${dollars}${cents}`);
  } else if (cents.length == 1) {
    return parseInt(`${dollars}${cents}0`);
  } else {
    return Number(amount)
  }
};

export { moneyFormatter, decimalToInt };
