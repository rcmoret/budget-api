interface MonthObject {
  short: string;
  long: string;
}

const MonthDictionary = (monthNumber: number): MonthObject => {
  switch (monthNumber) {
    case 1:
      return {
        short: "Jan.",
        long: "January",
      };
    case 2:
      return {
        short: "Feb.",
        long: "February",
      };
    case 3:
      return {
        short: "Mar.",
        long: "March",
      };
    case 4:
      return {
        short: "Apr.",
        long: "April",
      };
    case 5:
      return {
        short: "May",
        long: "May",
      };
    case 6:
      return {
        short: "June",
        long: "June",
      };
    case 7:
      return {
        short: "July",
        long: "July",
      };
    case 8:
      return {
        short: "Aug.",
        long: "August",
      };
    case 9:
      return {
        short: "Sep.",
        long: "September",
      };
    case 10:
      return {
        short: "Oct.",
        long: "October",
      };
    case 11:
      return {
        short: "Nov.",
        long: "November",
      };
    case 12:
      return {
        short: "Dec.",
        long: "December",
      };
    default:
      return {
        short: "",
        long: "",
      };
  }
};

type DateFormatString =
  | "default"
  | "m/d/yy"
  | "monthDay"
  | "monthYear"
  | "shortMonthYear";

interface DateFormatterProps {
  month: number;
  day?: number;
  year: number;
  format?: DateFormatString;
}

const DateFormatter = ({
  month,
  day,
  year,
  format,
}: DateFormatterProps): string => {
  const monthObject = MonthDictionary(month);

  switch (format) {
    case "m/d/yy":
      return `${month}/${day}/${year.toString().slice(-2)}`;
    case "monthDay":
      return `${monthObject.short} ${day}`;
    case "monthYear":
      return `${monthObject.long} ${year}`;
    case "shortMonthYear":
      return `${monthObject.short} ${year}`;
    default:
      return `${monthObject.short} ${day}, ${year}`;
  }
};

const dateParse = (dateString: string, opts?: { format: DateFormatString }) => {
  const format = opts?.format || "default";
  const dateElements = dateString.split("-");
  const month = parseInt(dateElements[1] || "0");
  const day = parseInt(dateElements[2] || "0");
  const year = parseInt(dateElements[0] || "1900");

  return DateFormatter({
    month,
    day,
    year,
    format,
  });
};

const monthOptionDefaults = {
  formatFn: (monthNumber: number) => MonthDictionary(monthNumber).long,
  includeNullOption: true,
};

interface MonthOption {
  label: string;
  value: number | null;
}

interface MonthOptionsProps {
  formatFn?: (number: number) => string;
  includeNullOption: boolean;
}

const monthOptions = (
  suppliedOptions: MonthOptionsProps = {
    includeNullOption: true,
  },
): MonthOption[] => {
  const { includeNullOption, formatFn } = {
    ...monthOptionDefaults,
    ...suppliedOptions,
  };
  const initialArray: MonthOption[] = includeNullOption
    ? [
        {
          value: null,
          label: "",
        },
      ]
    : [];

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce(
    (array, number) => [
      ...array,
      {
        label: formatFn(number),
        value: number,
      },
    ],
    initialArray,
  );
};

export { DateFormatter, dateParse, monthOptions };
