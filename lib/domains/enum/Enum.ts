export const Enum = {
  getKeys(enumToConvert: any): Array<string> {
    return Object.keys(enumToConvert).filter((x) => !(parseInt(x) >= 0));
  },
};
