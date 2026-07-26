import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { generateKeyIdentifier } from "@/utils/KeyIdentifier";
import { MonetaryAmount } from "@/types/amount";
import { TransactionDetail } from "@/types/transaction";
import { useTransactionContext } from "../context-provider";
import { useCallback, useState } from "react";

type DetailTuple = Pick<
  TransactionDetail,
  "budgetCategoryName" | "key" | "objectKey" | "budgetItemKey"
>;

type DetailAttribute = DetailTuple & { amount: MonetaryAmount };

const emptyAmount: MonetaryAmount = { cents: 0, display: "" };

// `objectKey` (`object_key` server-side) is a DOM-safe, prefixed identifier —
// good for React keys and the adjustment store, meaningless to the backend.
// The backend identifies a detail by its raw `key`, which is what actually
// gets sent in the submit payload (see `detailPayload` in context-provider).
const toDetailTuple = (detail: TransactionDetail): DetailTuple => ({
  key: detail.key,
  objectKey: detail.objectKey,
  budgetItemKey: detail.budgetItemKey,
  budgetCategoryName: detail.budgetCategoryName,
});

const useTransactionFormDetails = () => {
  const { transaction } = useTransactionContext();
  // Subscribe to the array itself, not to `getItem` — selecting the action gives
  // a stable reference, so the amounts read below would never re-render (and the
  // submit payload would keep the values from first paint).
  const adjustments = useAdjustmentStore((s) => s.adjustments);
  const addItem = useAdjustmentStore((s) => s.addItem);
  const removeItem = useAdjustmentStore((s) => s.removeItem);

  const [details, setDetails] = useState<DetailTuple[]>(
    transaction.details.map(toDetailTuple),
  );
  const addDetail = useCallback((key?: string) => {
    const objectKey = key || generateKeyIdentifier();
    addItem({ objectKey, amount: "" });
    setDetails((prev) => [
      // A brand-new detail has no server `object_key` to prefix yet, so
      // `objectKey` here is already the raw, backend-shaped key.
      ...prev,
      { key: objectKey, objectKey, budgetItemKey: null, budgetCategoryName: null },
    ]);
  }, []);
  const removeDetail = useCallback((key: string) => {
    removeItem(key);
    setDetails((prev) => prev.filter(({ objectKey }) => objectKey !== key));
  }, []);
  const nullifyDetailBudgetItemKey = useCallback((key: string) => {
    setDetails((prev) => {
      return prev.map((detail) => {
        if (detail.objectKey !== key) return detail;

        return {
          key: detail.key,
          objectKey: detail.objectKey,
          budgetItemKey: null,
          budgetCategoryName: null,
        };
      });
    });
  }, []);
  const setDetailBudgetItemKey = useCallback(
    (key: string, budgetItemKey: string, budgetCategoryName: string) => {
      setDetails((prev) => {
        return prev.map((detail) => {
          if (detail.objectKey !== key) return detail;

          return {
            key: detail.key,
            objectKey: detail.objectKey,
            budgetItemKey,
            budgetCategoryName,
          };
        });
      });
    },
    [],
  );

  const detailsWithAmounts: DetailAttribute[] = details.map((detail) => {
    const adjustment = adjustments.find(
      ({ objectKey }) => objectKey === detail.objectKey,
    );

    return { ...detail, amount: adjustment?.newTotal ?? emptyAmount };
  });

  return {
    addDetail,
    details: detailsWithAmounts,
    nullifyDetailBudgetItemKey,
    removeDetail,
    setDetailBudgetItemKey,
  };
};

export { type DetailAttribute, type DetailTuple, useTransactionFormDetails };
