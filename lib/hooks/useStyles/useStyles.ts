import { css, ObjectInterpolation } from "emotion";

export type IStyles = { [key: string]: ObjectInterpolation<undefined> };

export function useStyles<
  TStyleDefinitions extends { [key: string]: ObjectInterpolation<undefined> },
  TStyleDefinitionNames extends keyof TStyleDefinitions
>(
  styleDefinitions: {
    [key in TStyleDefinitionNames]: ObjectInterpolation<undefined>;
  },
  componentDisplayName: string
): { [key in TStyleDefinitionNames]: string } {
  const styleDefinitionNames = Object.keys(styleDefinitions);
  const processedClassNames = styleDefinitionNames.reduce(
    (result, definitionName) => {
      const label = `${componentDisplayName}-${definitionName}`;
      const emotionClassHash = css({
        ...styleDefinitions[definitionName],
        label: label,
      });
      return { ...result, [definitionName]: emotionClassHash };
    },
    {}
  ) as { [key in TStyleDefinitionNames]: string };
  return processedClassNames;
}
