type ThemeOption = "accent" | "secondary"

const outlineClasses = [
  "outline",
  "outline-neutral",
]

const pillClassName = (themeOption: ThemeOption) => [
  `text-${themeOption}-content`,
  `bg-${themeOption}`,
  ...(themeOption === "secondary" ? [] : outlineClasses),
  "shadow-sm",
  "rounded-lg",
  "px-3",
  "py-0.5",
  "text-xs"
].join(" ")

const Pill = (props: { children: React.ReactNode, themeOption: ThemeOption }) => {
  return (
    <div className={pillClassName(props.themeOption)}>
      {props.children}
    </div>
  )
}

export { Pill }
