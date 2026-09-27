import React from "react";

// One scroll-snapped region of the transaction form (a line item, the
// description/date/exclusion group, or the additional fields) — see
// plans/transaction-form-modal.md. `sectionKey` identifies it to
// `useActiveSectionKey`, which tracks the one currently snapped into view.
const Section = (props: {
  children: React.ReactNode;
  className?: string;
  sectionKey: string;
}) => {
  const className = ["transaction-form-section", props.className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className} data-section-key={props.sectionKey}>
      {props.children}
    </section>
  );
};

export { Section };
