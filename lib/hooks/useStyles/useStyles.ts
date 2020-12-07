import { css, CSSInterpolation } from "@emotion/css";

export type IStyles = { [key: string]: CSSInterpolation };

export function useStyles<
  TStyleDefinitions extends { [key: string]: CSSInterpolation },
  TStyleDefinitionNames extends keyof TStyleDefinitions
>(
  styleDefinitions: {
    [key in TStyleDefinitionNames]: CSSInterpolation;
  },
  componentDisplayName: string
): { [key in TStyleDefinitionNames]: string } {
  const styleDefinitionNames = Object.keys(styleDefinitions);
  const processedClassNames = styleDefinitionNames.reduce(
    (result, definitionName) => {
      const label = `${componentDisplayName}-${definitionName}`;
      const emotionClassHash = css({
        ...((styleDefinitions as unknown) as any)[definitionName],
        label: label,
      });
      return { ...result, [definitionName]: emotionClassHash };
    },
    {}
  ) as { [key in TStyleDefinitionNames]: string };
  return processedClassNames;
}
