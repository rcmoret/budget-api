import { perDiemAmounts } from "./per-diem";

describe("perDiemAmounts", () => {
  it("spreads budgeted over the month and remaining over the days left", () => {
    expect(
      perDiemAmounts({
        amount: -300_00,
        remaining: -150_00,
        totalDays: 30,
        daysRemaining: 10,
      }),
    ).toEqual({
      budgetedPerDay: -10_00,
      remainingPerDay: -15_00,
      perWeek: { budgeted: -70_00, remaining: -105_00 },
    });
  });

  it("truncates fractional cents toward zero", () => {
    expect(
      perDiemAmounts({
        amount: -100_00,
        remaining: 100_00,
        totalDays: 30,
        daysRemaining: 30,
      }),
    ).toEqual({
      budgetedPerDay: -333,
      remainingPerDay: 333,
      perWeek: { budgeted: -2333, remaining: 2333 },
    });
  });

  it("includes per week amounts when exactly a week remains", () => {
    const amounts = perDiemAmounts({
      amount: -70_00,
      remaining: -7_00,
      totalDays: 28,
      daysRemaining: 7,
    });

    expect(amounts?.perWeek).toEqual({ budgeted: -17_50, remaining: -7_00 });
  });

  it("omits per week amounts when less than a week remains", () => {
    const amounts = perDiemAmounts({
      amount: -70_00,
      remaining: -12_00,
      totalDays: 28,
      daysRemaining: 6,
    });

    expect(amounts?.remainingPerDay).toEqual(-2_00);
    expect(amounts?.perWeek).toBeNull();
  });

  it("returns null when no days remain", () => {
    expect(
      perDiemAmounts({
        amount: -70_00,
        remaining: -7_00,
        totalDays: 28,
        daysRemaining: 0,
      }),
    ).toBeNull();
  });
});
