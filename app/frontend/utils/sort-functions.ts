const byName = <NameSortable extends { name: string }>(
  obj1: NameSortable,
  obj2: NameSortable,
) => {
  return obj1.name.toLowerCase() < obj2.name.toLowerCase() ? -1 : 1;
};

export { byName };
