import { BudgetCategory } from "@/types/budget"
import { useToggle } from "@/lib/hooks/useToogle";
import { Card, TIcon } from "@/pages/budget/categories/Card"
import { CategoryForm } from "./Form";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-2 py-4">
      <div className="text-xl">
        Manage Category
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

const BudgetCategoryShowComponent = (props: {
  category: BudgetCategory;
  icons:  TIcon[];
}) => {
  const { category, icons } =  props

  const [isFormShown, toggleForm] = useToggle(false)

  if (!isFormShown) {
    return (
      <Wrapper>
        <Card
          category={category}
          openForm={toggleForm}
        />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <CategoryForm
          category={category}
          closeForm={toggleForm}
          icons={icons}
        />
      </Wrapper>
    )
  }
}

export default BudgetCategoryShowComponent
