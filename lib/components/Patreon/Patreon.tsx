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
    <Box
      component="a"
      target="_blank"
      rel="noreferrer"
      href="https://www.patreon.com/bePatron?u=43408921"
      sx={{
        color: "#fff !important",
      }}
    >
      <Box
        sx={{
          "background": "rgb(255, 66, 77)",
          "padding": "0.46875rem 1rem",
          "fontSize": "0.875rem",
          "borderRadius": "9999px",
          "textAlign": "center",
          "& a": {
            color: "#fff !important",
          },
        }}
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
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                whiteSpace: "nowrap",
              }}
            >
              {t("donation.patreon")}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
