import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React from "react";
import patreonImage from "url:../../../images/services/patreon.png";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const Patreon: React.FC = (props) => {
  const { t } = useTranslate();
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href="https://www.patreon.com/bePatron?u=43408921"
      className={css({
        color: "#fff !important",
      })}
    >
      <Box
        className={css({
          "background": "rgb(255, 66, 77)",
          "padding": "0.46875rem 1rem",
          "fontSize": "0.875rem",
          "borderRadius": "9999px",
          "& a": {
            color: "#fff !important",
          },
        })}
      >
        <Grid container wrap="nowrap" spacing={1} alignItems="center">
          <Grid item>
            <img width="16px" src={patreonImage} />
          </Grid>
          <Grid item>{t("donation.patreon")}</Grid>
        </Grid>
      </Box>
    </a>
  );
};
