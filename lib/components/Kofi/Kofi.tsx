import { css } from "@emotion/css";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const Kofi: React.FC<{}> = () => {
  let html: string = "";
  const { t } = useTranslate();
  const theme = useTheme();

  try {
    const kofiwidget2 = (window as any)["kofiwidget2"];
    if (kofiwidget2) {
      kofiwidget2.init(
        t("donation.kofi"),
        theme.palette.primary.main,
        "B0B4AHLJ"
      );
      html = kofiwidget2.getHTML();
    }
  } catch (error) {}

  return (
    <div
      className={css({
        "& span.kofitext": {
          color: `${theme.palette.getContrastText(
            theme.palette.primary.main
          )} !important`,
        },
      })}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
