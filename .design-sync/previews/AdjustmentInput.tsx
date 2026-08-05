import { AdjustmentInputsProvider, AdjustmentInput, TotalInput } from "@budget/design-system";

// AdjustmentInput and TotalInput read the shared adjustment store through the
// provider. With no matching objectKey in the store they fall back to the empty
// adjustment, so both fields show their 0.00 placeholder.
export const InProvider = () => (
  <div className="w-72">
    <AdjustmentInputsProvider objectKey="preview-item" editing="both">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="mr-auto text-sm">Adjustment</span>
          <div className="w-32"><AdjustmentInput name="adjustment" /></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-auto text-sm">New total</span>
          <div className="w-32"><TotalInput /></div>
        </div>
      </div>
    </AdjustmentInputsProvider>
  </div>
);
