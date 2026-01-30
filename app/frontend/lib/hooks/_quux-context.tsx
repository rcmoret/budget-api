import { useContext, createContext } from "react";

// Quux, waldo, and thud are metasyntactic variables

// The type that will be:
//   * the value passed to to the provider component:
//     * <Context.Provider value={...}>
//   * then returned by useQuuxContext()
type QuuxContextValue = {
  waldo: string;
};

// The type that will given to the provider
// eg: <QuuxProvider thud={23}>C'est si bon</QuuxProvider>
type QuuxProviderProps = {
  thud: number;
};

const QuuxContext = createContext<QuuxContextValue | null>(null);

// Returns a context provider / container
const QuuxProvider = (
  props: QuuxProviderProps & { children: React.ReactNode },
) => {
  const desc = "C'est La Mitomanie";
  const waldo = props.thud > 0 ? desc.toLowerCase() : desc.toUpperCase();

  // build up the value to return within a QuuxContext
  const value: QuuxContextValue = {
    waldo,
  };

  return (
    <QuuxContext.Provider value={value}>{props.children}</QuuxContext.Provider>
  );
};

// Define a hook that will provide the context values
const useQuuxContext = (): QuuxContextValue => {
  const context = useContext(QuuxContext);
  if (!context) {
    throw new Error("useQuuxContext must be used within a Quux Provider");
  }

  return context;
};

// always export:
//   * QuuxProvider
//   * useQuuxContext
// optionally export:
//   * type QuuxProviderProps
// rarely export:
//   * type QuuxContextValue

export { QuuxProvider, useQuuxContext };
