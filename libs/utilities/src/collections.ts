export function groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
  return arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

export const distinctBy = <T>(array: T[], selector?: (item: T) => any): T[] => {
  return array.filter(
    (e, i) =>
      array.findIndex((a) => {
        if (selector) {
          const x = selector(a);
          if (typeof x?.equals === 'function') {
            return x.equals(selector(e));
          }
          return x === selector(e);
        }
        return a === e;
      }) === i,
  );
};
