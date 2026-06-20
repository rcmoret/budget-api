import React from "react"

const Stack = (props: {
  children: React.ReactNode;
  items: Array<React.ReactNode>;
  textAlign?: "left" | "right"
}) => {
  const { textAlign = "left" } = props

  const className = `text-${textAlign} flex flex-col`

  return (
    <div className={className}>
      <div>
        {props.children}
      </div>
      {props.items.map((item, index) => (
        <StackItem key={index}>{item}</StackItem>
      ))}
    </div>
  )
}

const StackItem = (props: { children: React.ReactNode }) => {
  return (
    <div className="text-sm px-2">
      {props.children}
    </div>
  )
}

export { Stack }
