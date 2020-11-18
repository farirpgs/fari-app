import { css } from "@emotion/css";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import React from "react";
import patreonImage from "../../../images/services/patreon.png";

export const Patreon: React.FC = (props) => {
  return (
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
        <Grid item>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.patreon.com/bePatron?u=43408921"
          >
            Become a patron!
          </a>
        </Grid>
      </Grid>
    </Box>
  );
};
