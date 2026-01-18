import { useEffect } from "react"
import { useFinalizeFormContext } from "./form_context"

const KeyboardNav = () => {
  const {
    viewingCategoryKey,
    setNextReviewingCategoryKey,
    setPrevReviewingCategoryKey,
  } = useFinalizeFormContext()
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft')  {
        event.preventDefault();
        setPrevReviewingCategoryKey()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setNextReviewingCategoryKey()
      }
    }

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewingCategoryKey])

  return null
}

export { KeyboardNav }
