export type IDirection = "asc" | "desc";

export type IArraySortGetter<T> = (
  el: T
) => {
  value: unknown;
  direction: IDirection;
};

export function arraySort<T>(
  array: Array<T>,
  getters: Array<IArraySortGetter<T>>
) {
  if (!array) {
    return array;
  }

  const arrayToSort = [...array];

  return arrayToSort.sort((a, b) => {
    for (const getter of getters) {
      if (!getter) {
        return 0;
      }
      const fieldType = typeof getter(a)?.value;
      const sortingType = getter(a)?.direction ?? "asc";

      if (fieldType === "number") {
        const aNumber = getter(a).value as number;
        const bNumber = getter(b).value as number;
        const sortResult =
          sortingType === "asc" ? aNumber - bNumber : bNumber - aNumber;
        if (sortResult !== 0) {
          return sortResult;
        }
      }
      if (fieldType === "string") {
        const aString = (getter(a).value as string).toLowerCase();
        const bString = (getter(b).value as string).toLowerCase();
        const sortResult =
          sortingType === "asc"
            ? aString.localeCompare(bString, undefined, {
                numeric: true,
                sensitivity: "base",
              })
            : bString.localeCompare(aString, undefined, {
                numeric: true,
                sensitivity: "base",
              });
        if (sortResult !== 0) {
          return sortResult;
        }
      }
      if (fieldType === "boolean") {
        const aBoolean = getter(a).value as boolean;
        const bBoolean = getter(b).value as boolean;

        if (aBoolean !== bBoolean) {
          if (sortingType === "asc") {
            return aBoolean ? -1 : 1;
          } else {
            return aBoolean ? 1 : -1;
          }
        }
      }
    }

    return 0;
  });
}
