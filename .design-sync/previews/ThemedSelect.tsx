import { ThemedSelect } from "@budget/design-system";

const options = [
  { value: "groceries", label: "Groceries" },
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
];

export const Sizes = () => (
  <div className="flex flex-col gap-3 w-72">
    <ThemedSelect size="xs" options={options} defaultValue={options[0]} />
    <ThemedSelect size="sm" options={options} defaultValue={options[0]} />
    <ThemedSelect size="md" options={options} defaultValue={options[0]} />
    <ThemedSelect size="lg" options={options} defaultValue={options[0]} />
  </div>
);

export const Variants = () => (
  <div className="flex flex-col gap-3 w-72">
    <ThemedSelect size="sm" variant="primary" options={options} defaultValue={options[0]} />
    <ThemedSelect size="sm" variant="secondary" options={options} defaultValue={options[1]} />
    <ThemedSelect size="sm" variant="accent" options={options} defaultValue={options[2]} />
    <ThemedSelect size="sm" variant="error" options={options} defaultValue={options[0]} />
  </div>
);

export const Placeholder = () => (
  <div className="w-72">
    <ThemedSelect size="sm" options={options} placeholder="Choose a category…" />
  </div>
);
