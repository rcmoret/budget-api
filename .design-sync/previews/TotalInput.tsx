import { AdjustmentInputsProvider, TotalInput } from "@budget/design-system";

// Bound to the *total* side of an adjustment/total pair; editing it back-solves
// the adjustment. Requires an enclosing AdjustmentInputsProvider. With no
// matching objectKey in the store it falls back to the empty adjustment, so the
// field shows its 0.00 placeholder.
export const InProvider = () => (
  <div className="w-72">
    <AdjustmentInputsProvider objectKey="preview-item" editing="total">
      <div className="flex items-center gap-2">
        <span className="mr-auto text-sm">New total</span>
        <div className="w-32"><TotalInput /></div>
      </div>
    </AdjustmentInputsProvider>
  </div>
);
