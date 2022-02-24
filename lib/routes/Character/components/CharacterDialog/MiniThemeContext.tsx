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

export const MiniThemeContext = createContext<IMiniTheme>(
  undefined as unknown as IMiniTheme
);

export function useMiniTheme(props: {
  character?: ICharacter | undefined;
  enforceBackground?: string;
}) {
  const theme = useTheme();
  const defaultBackground = theme.palette.background.paper;

  const background = props.enforceBackground
    ? props.enforceBackground
    : props.character?.theme?.backgroundColor ?? defaultBackground;

  const textPrimary = getTextColor(theme, background);
  const textPrimaryInverted = getTextColor(theme, textPrimary);
  const isDarkTheme = textPrimary === "#fff";
  const textSecondary = isDarkTheme
    ? "rgba(255,255,255,0.7)"
    : "rgba(0,0,0,0.6)";
  const borderColor = isDarkTheme
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.12)";
  const style = props.character?.theme?.style || "";

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
  const infoTextFontFamily =
    props.character?.theme?.infoTextFontFamily || FontFamily.Default;
  const infoTextFontSize = props.character?.theme?.infoTextFontSize || 1;
  const infoTextFontWeight =
    props.character?.theme?.infoTextFontWeight || "normal";
  const helperTextFontFamily =
    props.character?.theme?.helperTextFontFamily || FontFamily.Default;
  const helperTextFontSize = props.character?.theme?.helperTextFontSize || 0.75;
  const helperTextFontWeight =
    props.character?.theme?.helperTextFontWeight || "normal";

  const primaryColor =
    props.character?.theme?.primaryColor || theme.palette.primary.main;
  const hideSectionBackground =
    props.character?.theme?.hideSectionBackground || false;
  const hideTabBackground = props.character?.theme?.hideTabBackground || false;

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

  const miniTheme = {
    backgroundColor: background,
    style: style,
    primaryColor: primaryColor,
    hideSectionBackground: hideSectionBackground,
    hideTabBackground: hideTabBackground,

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
    infoTextFontFamily: infoTextFontFamily,
    infoTextFontSize: infoTextFontSize,
    infoTextFontWeight: infoTextFontWeight,
    helperTextFontFamily: helperTextFontFamily,
    helperTextFontSize: helperTextFontSize,
    helperTextFontWeight: helperTextFontWeight,

    textPrimary: textPrimary,
    textSecondary: textSecondary,
    textPrimaryInverted: textPrimaryInverted,
    borderColor: borderColor,
    boxBackgroundColor: boxBackgroundColor,
    box2BackgroundColor: box2BackgroundColor,
    muiTheme: muiTheme,
  };

  return miniTheme;
}

export type IMiniTheme = ReturnType<typeof useMiniTheme>;

function getTextColor(theme: Theme, background: string) {
  try {
    const color = theme.palette.getContrastText(background);
    return color;
  } catch (error) {
    return theme.palette.getContrastText(theme.palette.background.paper);
  }
}
