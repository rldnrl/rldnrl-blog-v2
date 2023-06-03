export const select = <T, K>(
  array: readonly T[],
  mapper: (item: T, index: number) => K
) => {
  if (!array) return [];
  return array.reduce((acc, item, index) => {
    acc.push(mapper(item, index));
    return acc;
  }, [] as K[]);
};
