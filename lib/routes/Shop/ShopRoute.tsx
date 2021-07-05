import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import React from "react";
import { Settings } from "react-slick";
import { Page } from "../../components/Page/Page";
import { BetterSlider } from "./components/BetterSlider";
import { ProductDetails } from "./components/ProductDetails";
import { ShopCategory } from "./components/ShopCategory";
import { featuredGames, IGame, ShopCategories } from "./games/games";

export function ShopRoute() {
  const heroSliderSettings: Settings = {
    autoplay: false,
    dots: true,
    infinite: true,
    centerMode: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Page>
      <div
        className={css({
          marginTop: "-2rem",
        })}
      />
      <Container>
        <Box mb="2rem">
          <BetterSlider
            height="400px"
            settings={heroSliderSettings}
            className={css({})}
          >
            {featuredGames.map((game, i) => {
              return (
                <React.Fragment key={i}>{renderHeroSlide(game)}</React.Fragment>
              );
            })}
          </BetterSlider>
        </Box>
        {ShopCategories.map((category, i) => {
          return (
            <ShopCategory key={i} name={category.name} tags={category.tags} />
          );
        })}
      </Container>
    </Page>
  );

  function renderHeroSlide(game: IGame) {
    return (
      <div
        className={css({
          width: "100%",
          height: "400px",
          position: "relative",
        })}
      >
        <div
          className={css({
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "top": "0",
            "left": "0",
            "background": `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),url(${game.image})`,
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
        <ProductDetails
          game={game}
          color="#fff"
          justifyContent="space-evenly"
        />
      </div>
    );
  }
}

export default ShopRoute;
