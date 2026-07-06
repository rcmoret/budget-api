const RightColumnWrapper = (props: { children: React.ReactNode }) => {
  return (
    <div className="border rounded border-neutral-600 p-4">
      {props.children}
    </div>
  );
};

export { RightColumnWrapper };
