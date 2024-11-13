import { BudgetCategory} from "@/types/budget";

const sortByName = (category1: BudgetCategory, category2: BudgetCategory) => {
  return category1.name < category2.name ? -1 : 1
}

export { sortByName }
