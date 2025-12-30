const KeySpan = <T extends { _key: string; id?: string | number; hidden?: boolean }>(props: T) => {
  const { id, _key: key } = props;
  const { hidden } = { hidden: true, ...props }
  const className = hidden ? "hidden" : ""

  if (!id) {
    return (
      <span className={className}>
        key: {key}
      </span>
    );
  } else {
    return (
      <span id={String(id)} className={className}>
        {key}
      </span>
    );
  }
};

export { KeySpan };
