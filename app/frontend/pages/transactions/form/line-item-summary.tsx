import { RefObject, useEffect, useState } from "react";
import { AmountSpan } from "@/components/amount-span";
import { useTransactionFormContent } from "./context-provider";

const SECTION_SELECTOR = "[data-section-key]";

// Tracks which snapped section is in view inside `scrollRef`. Sections snap
// into place, so "more than half visible" picks out exactly one of them once
// scrolling settles.
const useActiveSectionKey = (scrollRef: RefObject<HTMLElement | null>) => {
  const { details } = useTransactionFormContent();
  const [activeSectionKey, setActiveSectionKey] = useState<null | string>(
    null,
  );
  // Re-observe when line items are added or removed — each is its own section.
  const detailKeys = details.map(({ objectKey }) => objectKey).join(",");

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        const key = (visible?.target as HTMLElement | undefined)?.dataset
          .sectionKey;
        if (key) setActiveSectionKey(key);
      },
      { root, threshold: 0.5 },
    );
    root
      .querySelectorAll(SECTION_SELECTOR)
      .forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [scrollRef, detailKeys]);

  const scrollToSection = (key: string) => {
    scrollRef.current
      ?.querySelector(`[data-section-key="${key}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return { activeSectionKey, scrollToSection };
};

// Desktop-only side column: the line items other than the one on screen — so
// all of them while the details or additional-fields section is showing.
// Each jumps to its own section.
const LineItemSummary = (props: {
  activeSectionKey: null | string;
  onSelect: (sectionKey: string) => void;
}) => {
  const { details } = useTransactionFormContent();
  const otherDetails = details.filter(
    ({ objectKey }) => objectKey !== props.activeSectionKey,
  );

  return (
    <aside className="transaction-form-summary" aria-label="Line items">
      <ul className="grid gap-1">
        {otherDetails.map((detail) => (
          <li key={detail.objectKey}>
            <button
              type="button"
              className="w-full flex justify-between gap-2 text-left text-sm cursor-pointer rounded px-2 py-1 hover:bg-base-200"
              onClick={() => props.onSelect(detail.objectKey)}
            >
              <span className="truncate">
                {detail.budgetCategoryName ?? (
                  <span className="opacity-60">No category</span>
                )}
              </span>
              <AmountSpan amount={detail.amount.cents} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export { LineItemSummary, useActiveSectionKey };
