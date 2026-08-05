import {
  AdjustmentInputsProvider,
  AdjustmentInput,
  TotalInput,
} from "@budget/design-system";

// The provider renders no markup of its own — it binds its children to one
// budget item in the shared adjustment store. `editing` decides which field
// starts editable.
export const BothFields = () => (
  <div className="w-72 p-3 rounded bg-base-200">
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

export const TotalOnly = () => (
  <div className="w-72 p-3 rounded bg-base-200">
    <AdjustmentInputsProvider objectKey="preview-item" editing="total">
      <div className="flex items-center gap-2">
        <span className="mr-auto text-sm">New total</span>
        <div className="w-32"><TotalInput /></div>
      </div>
    </AdjustmentInputsProvider>
  </div>
);
