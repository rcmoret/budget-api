import { useState } from "react";

const useToggle = (initialState: boolean = false) => {
  const [togglable, setTogglable] = useState<boolean>(initialState);

  return [togglable, () => setTogglable(!togglable)] as const;
};

export { useToggle };
