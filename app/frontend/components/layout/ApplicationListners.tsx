import { useEffect } from "react";
import { router } from "@inertiajs/react";

const KeyboardNav = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Left arrow - Previous month
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevLink = document.getElementById('month-year-pagination-prev') as HTMLAnchorElement;
        if (prevLink && prevLink.href) {
          router.visit(prevLink.href);
        }
      }

      // Right arrow - Next month
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextLink = document.getElementById('month-year-pagination-next') as HTMLAnchorElement;
        if (nextLink && nextLink.href) {
          router.visit(nextLink.href);
        }
      }

      // Page Up - Previous month (alternative)
      if (event.key === 'PageUp') {
        event.preventDefault();
        const prevLink = document.getElementById('month-year-pagination-prev') as HTMLAnchorElement;
        if (prevLink && prevLink.href) {
          router.visit(prevLink.href);
        }
      }

      // Page Down - Next month (alternative)
      if (event.key === 'PageDown') {
        event.preventDefault();
        const nextLink = document.getElementById('month-year-pagination-next') as HTMLAnchorElement;
        if (nextLink && nextLink.href) {
          router.visit(nextLink.href);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null; // This component doesn't render anything
};

const InputScrollHandler = () => {
  useEffect(() => {
    const handleWheel = () => {
      if(document.activeElement.type === "number"){
        document.activeElement.blur();
      }
    }
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [])
  return null; // This component doesn't render anything
}

export { InputScrollHandler, KeyboardNav };
