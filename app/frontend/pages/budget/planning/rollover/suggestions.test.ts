import {
  highlightedSuggestion,
  isReviewed,
  isValid,
  rolloverAll,
  rolloverNone,
  rolloverPartial,
  unappliedAmount,
  ItemAmounts,
} from "./suggestions";

const unset = {
  cents: 0,
  display: "", 
};
const money = (cents: number) => ({
  cents,
  display: (cents / 100).toFixed(2),
});

const item = (props: Partial<ItemAmounts> = {
}): ItemAmounts => ({
  adjustment: unset,
  remaining: money(-100_00),
  eventKey: "target-key",
  ...props,
});

describe("isReviewed", () => {
  it("needs both an event key and an adjustment", () => {
    expect(isReviewed(item({
      adjustment: money(0), 
    }))).toBe(true);
    expect(isReviewed(item({
      adjustment: unset, 
    }))).toBe(false);
    expect(isReviewed(item({
      adjustment: money(0),
      eventKey: null, 
    }))).toBe(
      false
    );
  });
});

describe("isValid", () => {
  it("covers zero to the remaining amount for an expense", () => {
    expect(isValid(item({
      adjustment: money(-40_00), 
    }))).toBe(true);
    expect(isValid(item({
      adjustment: money(-100_00), 
    }))).toBe(true);
    expect(isValid(item({
      adjustment: money(-100_01), 
    }))).toBe(false);
    expect(isValid(item({
      adjustment: money(1), 
    }))).toBe(false);
  });

  it("covers zero to the remaining amount for a revenue", () => {
    const remaining = money(100_00);

    expect(isValid(item({
      remaining,
      adjustment: money(40_00), 
    }))).toBe(true);
    expect(isValid(item({
      remaining,
      adjustment: money(-1), 
    }))).toBe(false);
    expect(isValid(item({
      remaining,
      adjustment: money(100_01), 
    }))).toBe(
      false
    );
  });
});

describe("highlightedSuggestion", () => {
  it("is nothing until an adjustment is set", () => {
    expect(highlightedSuggestion(item())).toBeNull();
  });

  it("is all when the adjustment equals the remaining amount", () => {
    expect(highlightedSuggestion(item({
      adjustment: money(-100_00), 
    }))).toBe(
      "all"
    );
  });

  it("is none for a reviewed zero adjustment", () => {
    expect(highlightedSuggestion(item({
      adjustment: money(0), 
    }))).toBe("none");
  });

  it("is nothing for a zero adjustment without a target", () => {
    expect(
      highlightedSuggestion(item({
        adjustment: money(0),
        eventKey: null, 
      }))
    ).toBeNull();
  });

  it("is partial for a reviewed, valid amount in between", () => {
    expect(highlightedSuggestion(item({
      adjustment: money(-40_00), 
    }))).toBe(
      "partial"
    );
  });

  it("is nothing for an invalid amount", () => {
    expect(
      highlightedSuggestion(item({
        adjustment: money(-140_00), 
      }))
    ).toBeNull();
  });

  it("prefers all when nothing remains", () => {
    expect(
      highlightedSuggestion(
        item({
          remaining: money(0),
          adjustment: money(0), 
        })
      )
    ).toBe("all");
  });
});

describe("rolloverAll", () => {
  it("sets the adjustment to the remaining amount", () => {
    expect(rolloverAll(item()).adjustment).toEqual(money(-100_00));
  });

  it("clears a none target so a real one gets picked", () => {
    expect(rolloverAll(item({
      eventKey: "none", 
    })).eventKey).toBeNull();
    expect(rolloverAll(item()).eventKey).toBe("target-key");
  });
});

describe("rolloverNone", () => {
  it("sets a zero adjustment", () => {
    expect(rolloverNone(item()).adjustment).toEqual(money(0));
  });

  it("targets none only when nothing was picked", () => {
    expect(rolloverNone(item({
      eventKey: null, 
    })).eventKey).toBe("none");
    expect(rolloverNone(item()).eventKey).toBe("target-key");
  });
});

describe("rolloverPartial", () => {
  it("gives the typed amount the remaining amount's sign", () => {
    expect(rolloverPartial(item(), "40").adjustment).toEqual(money(-40_00));
    expect(rolloverPartial(item(), "-40").adjustment).toEqual(money(-40_00));
    expect(
      rolloverPartial(item({
        remaining: money(100_00), 
      }), "40").adjustment
    ).toEqual(money(40_00));
  });

  it("unsets the adjustment when the input is cleared", () => {
    expect(rolloverPartial(item(), "").adjustment).toEqual(unset);
  });
});

describe("unappliedAmount", () => {
  it("is what's left after the adjustment once reviewed", () => {
    expect(unappliedAmount(item({
      adjustment: money(-40_00), 
    }))).toEqual(
      money(-60_00)
    );
  });

  it("is blank until reviewed", () => {
    expect(unappliedAmount(item())).toEqual(unset);
  });
});
