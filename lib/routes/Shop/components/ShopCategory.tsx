import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import shuffle from "lodash/shuffle";
import React, { useMemo } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Settings } from "react-slick";
import { arraySort } from "../../../domains/array/arraySort";
import { ShopLink } from "../domains/ShopLink";
import { games, IGame } from "../games/games";
import { BetterSlider } from "./BetterSlider";

export function useGames(tags: string | undefined) {
  return useMemo(() => {
    const tagsList = tags?.split(",").map((t) => t.trim()) ?? [];

    const gamesMatchingTags = games.filter((g) => {
      return g.tags.some((t) => tagsList.includes(t));
    });

    const gamesGroupedByRating = gamesMatchingTags.reduce<
      Record<string, Array<IGame>>
    >((acc, curr) => {
      const rating = curr.rating.toString();
      const list = acc[rating] ?? [];
      return {
        ...acc,
        [rating]: [...list, curr],
      };
    }, {});

    const sortedRatings = arraySort(Object.keys(gamesGroupedByRating), [
      (rating) => ({ direction: "desc", value: rating }),
    ]);
    const shuffledGamesGroupedByRating = sortedRatings.flatMap((rating) => {
      return shuffle(gamesGroupedByRating[rating]);
    });
    const numberOfItemsToReturn = 10;
    return shuffledGamesGroupedByRating.slice(0, numberOfItemsToReturn);
  }, [tags]);
}

export function ShopCategory(props: {
  name: string;
  tags: string;
  count?: number;
}) {
  const gamesForTags = useGames(props.tags);
  const gamesToDisplay = gamesForTags.slice(0, props.count);

  const productSliderSettings: Settings = {
    autoplay: false,
    dots: false,
    infinite: false,
    centerMode: false,
    speed: 500,
    slidesToScroll: 5,
    variableWidth: true,
  };

  return (
    <Box mb="2rem">
      <Box>
        <Typography variant="h6">{props.name}</Typography>
      </Box>

      <BetterSlider
        height="12rem"
        settings={productSliderSettings}
        className={css({
          "& .slick-track": {
            margin: "0 -.5rem", // for product gap
          },
        })}
      >
        {gamesToDisplay.map((game, i) => {
          return (
            <React.Fragment key={i}>{renderProductCard(game)}</React.Fragment>
          );
        })}
      </BetterSlider>
    </Box>
  );

  function renderProductCard(game: IGame) {
    const gap = ".5rem";
    return (
      <ReactRouterLink
        to={ShopLink.makeGameLink(game)}
        className={css({
          position: "relative",
          cursor: "pointer",
        })}
      >
        <div
          className={css({
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "top": "0",
            "left": "0",
            // "background": `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),url(${game.image})`,
            "backgroundRepeat": "no-repeat",
            "backgroundSize": "cover",
            "backgroundPosition": "center",

            "&:after": {
              backdropFilter: "blur(16px)",
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none" /* make the overlay click-through */,
            },
          })}
        />
        <div
          className={css({
            height: "12rem",
            margin: `0 ${gap}`,
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
    );
  }
}
