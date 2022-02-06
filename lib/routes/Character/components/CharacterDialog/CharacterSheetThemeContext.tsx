import {
  createTheme,
  darken,
  lighten,
  responsiveFontSizes,
  Theme,
  useTheme,
} from "@mui/material/styles";
import produce from "immer";
import { createContext, useMemo } from "react";
import { FontFamily } from "../../../../constants/FontFamily";
import { ICharacter } from "../../../../domains/character/types";
import { defaultThemeConfiguration } from "../../../../theme";

export const CharacterSheetThemeContext = createContext<ISuperTheme>(
  undefined as unknown as ISuperTheme
);

export function useCharacterSheetTheme(props: {
  character: ICharacter | undefined;
}) {
  const theme = useTheme();
  const background =
    props.character?.theme?.backgroundColor || theme.palette.background.paper;
  const textPrimary = getTextColor(theme, background);
  const textPrimaryInverted = getTextColor(theme, textPrimary);
  const isDarkTheme = textPrimary === "#fff";
  const textSecondary = isDarkTheme
    ? "rgba(255,255,255,0.7)"
    : "rgba(0,0,0,0.6)";
  const borderColor = isDarkTheme
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.12)";
  const fontImport = props.character?.theme?.fontImport || "";

  const pageHeadingFontFamily =
    props.character?.theme?.pageHeadingFontFamily || FontFamily.Default;
  const pageHeadingFontSize =
    props.character?.theme?.pageHeadingFontSize || 1.25;
  const pageHeadingFontWeight =
    props.character?.theme?.pageHeadingFontWeight || "bold";
  const sectionHeadingFontFamily =
    props.character?.theme?.sectionHeadingFontFamily || FontFamily.Default;
  const sectionHeadingFontSize =
    props.character?.theme?.sectionHeadingFontSize || 1.25;
  const sectionHeadingFontWeight =
    props.character?.theme?.sectionHeadingFontWeight || "bold";
  const labelFontFamily =
    props.character?.theme?.labelFontFamily || FontFamily.Default;
  const labelFontSize = props.character?.theme?.labelFontSize || 1.2;
  const labelFontWeight = props.character?.theme?.labelFontWeight || "bold";
  const textFontFamily =
    props.character?.theme?.textFontFamily || FontFamily.Default;
  const textFontSize = props.character?.theme?.textFontSize || 1;
  const textFontWeight = props.character?.theme?.textFontWeight || "normal";

  const primaryColor =
    props.character?.theme?.primaryColor || theme.palette.primary.main;
  const hideSectionBackground =
    props.character?.theme?.hideSectionBackground || false;

  const boxBackgroundColor = isDarkTheme
    ? lighten(background, 0.1)
    : darken(background, 0.1);

  const box2BackgroundColor = isDarkTheme
    ? lighten(background, 0.2)
    : darken(background, 0.2);

  const muiTheme = useMemo(() => {
    const options = produce(defaultThemeConfiguration, (draft) => {
      draft.palette = {
        text: {
          primary: textPrimary,
          secondary: textSecondary,
        },
        primary: { main: textPrimary },
        background: {
          // paper: background,
          default: background,
        },
      };
      const defaultType = textPrimary === "#fff" ? "dark" : "light";
      draft.palette.mode = defaultType;
    });
    return responsiveFontSizes(createTheme(options));
  }, [background, textPrimary, textSecondary]);

  const superTheme = {
    backgroundColor: background,
    fontImport: fontImport,
    primaryColor: primaryColor,
    hideSectionBackground: hideSectionBackground,

    pageHeadingFontFamily: pageHeadingFontFamily,
    pageHeadingFontSize: pageHeadingFontSize,
    pageHeadingFontWeight: pageHeadingFontWeight,
    sectionHeadingFontFamily: sectionHeadingFontFamily,
    sectionHeadingFontSize: sectionHeadingFontSize,
    sectionHeadingFontWeight: sectionHeadingFontWeight,
    labelFontFamily: labelFontFamily,
    labelFontSize: labelFontSize,
    labelFontWeight: labelFontWeight,
    textFontFamily: textFontFamily,
    textFontSize: textFontSize,
    textFontWeight: textFontWeight,

    textPrimary: textPrimary,
    textSecondary: textSecondary,
    textPrimaryInverted: textPrimaryInverted,
    borderColor: borderColor,
    boxBackgroundColor: boxBackgroundColor,
    box2BackgroundColor: box2BackgroundColor,
    muiTheme: muiTheme,
  };

  return superTheme;
}

export type ISuperTheme = ReturnType<typeof useCharacterSheetTheme>;

function getTextColor(theme: Theme, background: string) {
  try {
    const color = theme.palette.getContrastText(background);
    return color;
  } catch (error) {
    return theme.palette.getContrastText(theme.palette.background.paper);
  }
}
