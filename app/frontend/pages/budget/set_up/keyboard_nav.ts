import { useEffect } from "react"
import { useSetupEventsFormContext } from "@/pages/budget/set_up";


const KeyboardNav = () => {
  const {
    changePreviousCategory,
    changeNextCategory,
    changePreviousUnreviewedCategory,
    changeNextUnreviewedCategory,
    budgetCategory
  } = useSetupEventsFormContext()

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) { return; }

      if (event.shiftKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        changePreviousCategory()
      }

      if (event.shiftKey && event.key === 'ArrowRight') {
        event.preventDefault();
        changeNextCategory()
      }

      if (event.shiftKey && event.key === 'ArrowUp') {
        event.preventDefault();
        changePreviousUnreviewedCategory()
      }

      if (event.shiftKey && event.key === 'ArrowDown') {
        event.preventDefault();
        changeNextUnreviewedCategory()
      }
    }

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [budgetCategory.slug])

  return null
}

export { KeyboardNav }
