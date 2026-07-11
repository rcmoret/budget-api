import { useEffect } from "react";
import { router } from "@inertiajs/react";
import { useNeighborLinksStore } from "@/pages/budget/neighbor-links-store";

const useNeighborLinksKeyBoardHandlers = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const { previous, next } = useNeighborLinksStore.getState();
      const href = event.key === "ArrowLeft" ? previous.href : next.href;

      if (!href) return;

      event.preventDefault();
      router.visit(href);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};

export { useNeighborLinksKeyBoardHandlers };
