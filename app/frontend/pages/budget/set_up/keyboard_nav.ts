import { useEffect } from "react"
import { useSetupEventsFormContext } from "@/lib/hooks/useSetUpEventsForm";


const KeyboardNav = () => {
  const {
    changePreviousCategory,
    changeNextCategory,
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
    }

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [budgetCategory.slug])

  return null
}

export { KeyboardNav }
