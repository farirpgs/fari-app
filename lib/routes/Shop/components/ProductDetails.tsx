import { css } from "@emotion/css";
import Grid, { GridJustification } from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { AppButtonLink } from "../../../components/AppLink/AppLink";
import { useThemeFromColor } from "../../../hooks/useThemeFromColor/useThemeFromColor";
import { ShopLink } from "../domains/ShopLink";
import {
  driveThruRpgAffiliateCode,
  IGame,
  itchIoAffiliateCode,
} from "../games/games";

export function ProductDetails(props: {
  game: IGame | undefined;
  justifyContent?: GridJustification;
  color: string;
}) {
  const productTheme = useThemeFromColor(props.color);

  if (!props.game) {
    return null;
  }
  return (
    <>
      <Grid
        container
        alignItems="center"
        justify={props.justifyContent}
        className={css({
          zIndex: 1,
          position: "relative",
          minHeight: "400px",
          paddingBottom: "2rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        })}
      >
        <Grid item xs={12} sm={8} md={6}>
          <div>
            <div
              className={css({
                color: productTheme.palette.text.primary,
                bottom: "4rem",
                left: "4rem",
                fontSize: "3.5rem",
                lineHeight: "3rem",
                textAlign: "left",
                marginBottom: ".5rem",
                display: "flex",
                fontWeight: 800,
              })}
            >
              <ReactRouterLink
                to={ShopLink.makeGameLink(props.game)}
                className={css({
                  color: productTheme.palette.text.primary,
                  cursor: "pointer",
                })}
              >
                {props.game.name}
              </ReactRouterLink>
            </div>
            <div
              className={css({
                color: productTheme.palette.text.primary,
                bottom: "4rem",
                left: "4rem",
                fontSize: "1rem",
                textAlign: "left",
                marginBottom: "2rem",
                display: "flex",
              })}
            >
              {props.game.description}
            </div>

            <div
              className={css({
                color: productTheme.palette.text.primary,
                marginBottom: "1rem",
              })}
            >
              <Typography variant="subtitle2">Available on:</Typography>
              <ThemeProvider theme={productTheme}>
                <Grid container spacing={1}>
                  {props.game.links.itchIo && (
                    <Grid item>
                      <AppButtonLink
                        variant="outlined"
                        to={props.game.links.itchIo + itchIoAffiliateCode}
                        target="_blank"
                        className={css({
                          textTransform: "none",
                        })}
                      >
                        Itch.io
                      </AppButtonLink>
                    </Grid>
                  )}
                  {props.game.links.driveThru && (
                    <Grid item>
                      <AppButtonLink
                        variant="outlined"
                        to={
                          props.game.links.driveThru + driveThruRpgAffiliateCode
                        }
                        target="_blank"
                        className={css({
                          textTransform: "none",
                        })}
                      >
                        DriveThruRPG
                      </AppButtonLink>
                    </Grid>
                  )}
                </Grid>
              </ThemeProvider>
            </div>
            <div
              className={css({
                color: productTheme.palette.text.primary,
                bottom: "4rem",
                left: "4rem",
                fontSize: ".8rem",
                textAlign: "left",
                marginBottom: "1rem",
                display: "flex",
              })}
            >
              By: {props.game.creator}
            </div>
          </div>
        </Grid>
        <Hidden smDown>
          <Grid item>
            <ReactRouterLink
              to={ShopLink.makeGameLink(props.game)}
              className={css({
                cursor: "pointer",
              })}
            >
              <div
                className={css({
                  height: "100%",
                })}
              >
                <img
                  src={props.game.image}
                  className={css({
                    width: "auto",
                    height: "100%",
                    maxHeight: "300px",
                    border: "4px solid #fff",
                  })}
                />
              </div>
            </ReactRouterLink>
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
}
