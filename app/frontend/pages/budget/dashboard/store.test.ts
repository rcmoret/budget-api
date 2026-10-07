import { itemGroupLabels } from "./store";

describe("itemGroupLabels", () => {
  it("labels fixed expenses", () => {
    expect(itemGroupLabels({ isFixed: true, isExpense: true })).toEqual([
      "Fixed",
      "Expenses",
    ]);
  });

  it("labels fixed revenues", () => {
    expect(itemGroupLabels({ isFixed: true, isExpense: false })).toEqual([
      "Fixed",
      "Revenues",
    ]);
  });

  it("labels variable expenses", () => {
    expect(itemGroupLabels({ isFixed: false, isExpense: true })).toEqual([
      "Variable",
      "Expenses",
    ]);
  });

  it("labels variable revenues", () => {
    expect(itemGroupLabels({ isFixed: false, isExpense: false })).toEqual([
      "Variable",
      "Revenues",
    ]);
  });
});
