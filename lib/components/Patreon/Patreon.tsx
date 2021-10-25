import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import patreonImage from "../../../images/services/patreon.png";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const Patreon: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
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
          "textAlign": "center",
          "& a": {
            color: "#fff !important",
          },
        })}
      >
        <Grid
          container
          wrap="nowrap"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <img width="16px" src={patreonImage} />
          </Grid>
          <Grid item>
            <Typography
              className={css({ fontWeight: theme.typography.fontWeightBold })}
            >
              {t("donation.patreon")}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </a>
  );
};
