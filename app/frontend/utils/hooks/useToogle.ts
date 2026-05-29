import { useState } from "react";

const useToggle = (initialState: boolean = false) => {
  const [isToggled, setTogglable] = useState<boolean>(initialState);

  return [isToggled, () => setTogglable(!isToggled)] as const;
};

export { useToggle };
