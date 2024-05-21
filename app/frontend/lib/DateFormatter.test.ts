import { DateFormatter, dateParse, monthOptions } from "./DateFormatter";

it("returns a default date format eg Dec. 13, 2019", () => {
  const actual = DateFormatter({
    month: 12,
    day: 13,
    year: 2019,
  });
  expect(actual).toEqual("Dec. 13, 2019");
});

it("returns the full name of month and 4 digit year when 'monthYear' is the specified format", () => {
  const actual = DateFormatter({
    month: 5,
    year: 2021,
    day: 30,
    format: "monthYear",
  });
  expect(actual).toEqual("May 2021");
});

it("returns the shortened name of the month and 4 digit year when 'shortMonthYear' is the specified format", () => {
  const actual = DateFormatter({
    month: 3,
    year: 2018,
    day: 2,
    format: "shortMonthYear",
  });
  expect(actual).toEqual("Mar. 2018");
});

it("returns a formatted string from a date time string", () => {
  const timeString = "2020-08-09, 12:00:00 AM";
  const actual = dateParse(timeString);
  expect(actual).toEqual("Aug. 9, 2020");
});

it("returns a formatted string from a date time string", () => {
  const timeString = "2020-08-09, 12:00:00 AM";
  const actual = dateParse(timeString, {
    format: "monthYear",
  });
  expect(actual).toEqual("August 2020");
});

it("returns a list of months", () => {
  const actual = monthOptions();
  expect(actual).toEqual([
    {
      label: "",
      value: null,
    },
    {
      label: "January",
      value: 1,
    },
    {
      label: "February",
      value: 2,
    },
    {
      label: "March",
      value: 3,
    },
    {
      label: "April",
      value: 4,
    },
    {
      label: "May",
      value: 5,
    },
    {
      label: "June",
      value: 6,
    },
    {
      label: "July",
      value: 7,
    },
    {
      label: "August",
      value: 8,
    },
    {
      label: "September",
      value: 9,
    },
    {
      label: "October",
      value: 10,
    },
    {
      label: "November",
      value: 11,
    },
    {
      label: "December",
      value: 12,
    },
  ]);
});
