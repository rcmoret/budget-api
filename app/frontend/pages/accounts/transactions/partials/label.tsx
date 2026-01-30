const Label = ({
  label,
  children,
  classes,
}: {
  label: string;
  children?: React.ReactNode;
  classes?: Array<string>;
}) => {
  const className = ["text-sm", ...(classes || [])].join(" ");

  if (children) {
    return (
      <div className={className}>
        {label} {children}
      </div>
    );
  } else {
    return <div className={className}>{label}</div>;
  }
};

export { Label };
