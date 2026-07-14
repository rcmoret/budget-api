const RightColumnWrapper = (props: { children: React.ReactNode }) => {
  if (!props.children) return null;

  return (
    <div className="border rounded border-neutral-600 p-4">
      {props.children}
    </div>
  );
};

export { RightColumnWrapper };
