export function getSafe<T>(getter: () => T, defaultValue = undefined): T {
  try {
    const getterValue = getter();
    if (getterValue === undefined || getterValue === null) {
      return defaultValue;
    }
    return getterValue;
  } catch (error) {
    return defaultValue;
  }
}
