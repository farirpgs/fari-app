import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Images } from "../../constants/Images";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const Patreon: React.FC = (props) => {
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
          justify="center"
        >
          <Grid item>
            <img width="16px" src={Images.patreon} />
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
