const clamp = (p: { value: number; min: number; max: number }) => {
  const { value, min, max } = p;

  return Math.min(Math.max(value, min), max);
};

export { clamp };
