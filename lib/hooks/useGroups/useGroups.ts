import { useMemo } from "react";

export function useGroups<T>(
  list: Array<T>,
  getter: (item: T) => string | undefined
) {
  const groups = useMemo(() => {
    const sortedGroups = list.map(getter);
    const uniqGroups = sortedGroups.filter(
      (g, i) => sortedGroups.indexOf(g) === i
    );
    const validGroups = uniqGroups.filter((g) => !!g) as Array<string>;
    return validGroups;
  }, [list]);

  return groups;
}
