const byClearanceDate = <
  T extends {
    clearanceDate: string;
    updatedAt: string;
    isCleared: boolean;
    isPending: boolean;
  },
>(
  transaction1: T,
  transaction2: T,
) => {
  const today = new Date().toISOString().split("T")[0];
  const txn1ClearanceDate = String(transaction1.clearanceDate);
  const txn2ClearanceDate = String(transaction2.clearanceDate);

  if (txn1ClearanceDate === txn2ClearanceDate) {
    return transaction1.updatedAt < transaction2.updatedAt ? -1 : 1;
  } else if (transaction1.isCleared && transaction2.isCleared) {
    return txn1ClearanceDate < txn2ClearanceDate ? -1 : 1;
  } else if (transaction1.isPending) {
    return txn2ClearanceDate > today ? -1 : 1;
  } else {
    return txn1ClearanceDate <= today ? -1 : 1;
  }
};

const byCategoryName = <T extends { key: string; budgetCategoryName: string }>(
  detail1: T,
  detail2: T,
) => {
  if (detail1.budgetCategoryName === detail2.budgetCategoryName) {
    return detail1.key > detail2.key ? -1 : 1;
  } else {
    return String(detail1.budgetCategoryName) <
      String(detail2.budgetCategoryName)
      ? -1
      : 1;
  }
};

const byAmount = <T extends { amount: number; key: string }>(
  detail1: T,
  detail2: T,
) => {
  if (detail1.amount === detail2.amount) {
    return detail1.key > detail2.key ? -1 : 1;
  } else {
    return Math.abs(detail2.amount) - Math.abs(detail1.amount);
  }
};

const byName = <NameSortable extends { name: string }>(
  item1: NameSortable,
  item2: NameSortable,
) => {
  return item1.name < item2.name ? -1 : 1;
};

const byKey = <T extends { key: string }>(item1: T, item2: T) => {
  return item1.key > item2.key ? -1 : 1;
};

const byLabel = <T extends { label: string }>(item1: T, item2: T) => {
  return item1.label < item2.label ? -1 : 1;
};

const byPriority = <T extends { priority: number }>(
  account1: T,
  account2: T,
) => {
  return account1.priority - account2.priority;
};

const byComparisonDate = <T extends { comparisonDate: string }>(
  detail1: T,
  detail2: T,
) => {
  return detail1.comparisonDate < detail2.comparisonDate ? -1 : 1;
};

const byNameAndAmount = <
  T extends { key: string; name: string; amount: number },
>(
  item1: T,
  item2: T,
) => {
  // when the items have different names
  if (item1.name !== item2.name) {
    return byName(item1, item2);
  }

  // when the items have the same name
  if (item1.amount === item2.amount) {
    return item1.key < item2.key ? -1 : 1;
  } else {
    return Math.abs(item1.amount) - Math.abs(item2.amount);
  }
};

export {
  byAmount,
  byCategoryName,
  byClearanceDate,
  byComparisonDate,
  byKey,
  byLabel,
  byName,
  byNameAndAmount,
  byPriority,
};
