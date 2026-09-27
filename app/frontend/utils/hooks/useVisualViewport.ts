import { useEffect, useState } from "react";

type VisualViewportSnapshot = {
  height: number;
  offsetTop: number;
};

const readViewport = (): VisualViewportSnapshot | null => {
  const viewport = window.visualViewport;
  if (!viewport) return null;

  return { height: viewport.height, offsetTop: viewport.offsetTop };
};

// iOS Safari doesn't shrink the layout viewport (and therefore `dvh`/`vh`)
// when the on-screen keyboard opens, and can scroll the page to keep a
// focused input visible — both of which a `position: fixed` element sized
// and placed off the plain viewport ignores, so it ends up rendered partly
// behind the keyboard. This tracks the region actually visible above the
// keyboard so a fixed element can be sized and positioned against it
// directly instead.
const useVisualViewport = (): VisualViewportSnapshot | null => {
  const [viewport, setViewport] = useState<VisualViewportSnapshot | null>(
    readViewport,
  );

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const update = () => setViewport(readViewport());
    visualViewport.addEventListener("resize", update);
    visualViewport.addEventListener("scroll", update);

    return () => {
      visualViewport.removeEventListener("resize", update);
      visualViewport.removeEventListener("scroll", update);
    };
  }, []);

  return viewport;
};

export { useVisualViewport };
