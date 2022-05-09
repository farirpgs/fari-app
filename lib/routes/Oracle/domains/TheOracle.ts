export type OracleValues = "YesAnd" | "Yes" | "YesBut" | "No" | "NoAnd";

const OracleValuesMapping: Record<OracleValues, [min: number, max: number]> = {
  ["YesAnd"]: [4, 99],
  ["Yes"]: [1, 3],
  ["YesBut"]: [0, 0],
  ["No"]: [-3, -1],
  ["NoAnd"]: [-99, -4],
};

export const TheOracle = {
  getValue(val: number): OracleValues {
    const [oracleValue] =
      Object.entries(OracleValuesMapping).find(([, [min, max]]) => {
        return val >= min && val <= max;
      }) ?? [];

    return (oracleValue as unknown) as OracleValues;
  },
};
