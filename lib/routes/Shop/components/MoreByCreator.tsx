import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import kebabCase from "lodash/kebabCase";
import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ShopLink } from "../domains/ShopLink";
import { games } from "../games/games";

export function MoreByCreator(props: {
  creator: string | undefined;
  count?: number;
}) {
  const kebabPropsCreator = kebabCase(props.creator);
  const creatorsGames = games.filter((g) => {
    const creatorSlug = kebabCase(g.creator);

    return kebabPropsCreator === creatorSlug;
  });

  const [firstGame] = creatorsGames;

  const gamesToDisplay = creatorsGames.slice(0, props.count);

  if (!firstGame) {
    return null;
  }

  return (
    <>
      <Box>
        <Typography variant="h6">More by {firstGame.creator}</Typography>
      </Box>

      <Grid container spacing={2}>
        {gamesToDisplay.map((game, i) => {
          return (
            <Grid item key={i}>
              <ReactRouterLink
                to={ShopLink.makeGameLink(game)}
                className={css({
                  position: "relative",
                  cursor: "pointer",
                })}
              >
                <div
                  className={css({
                    height: "12rem",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  })}
                >
                  <img
                    src={game.image}
                    className={css({
                      height: "12rem",
                      width: "auto",
                      margin: "0 auto",
                      position: "relative",
                      zIndex: 1,
                    })}
                  />
                </div>
              </ReactRouterLink>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
