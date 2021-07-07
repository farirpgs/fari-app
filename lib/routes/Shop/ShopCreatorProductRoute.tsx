import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import kebabCase from "lodash/kebabCase";
import shuffle from "lodash/shuffle";
import React from "react";
import { useRouteMatch } from "react-router";
import { Link as ReactRouterLink } from "react-router-dom";
import { Page } from "../../components/Page/Page";
import { MoreByCreator } from "./components/MoreByCreator";
import { ProductDetails } from "./components/ProductDetails";
import { ShopCategory } from "./components/ShopCategory";
import { ShopLink } from "./domains/ShopLink";
import { games } from "./games/games";

export function ShopCreatorProductRoute() {
  const match = useRouteMatch<{ creatorSlug: string; productSlug: string }>();

  const selectedGame = games.find((g) => {
    const creatorSlug = kebabCase(g.creator);
    const productSlug = kebabCase(g.name);

    return (
      match.params.creatorSlug === creatorSlug &&
      match.params.productSlug === productSlug
    );
  });
  const selectedGameTags = selectedGame?.tags ?? [];
  const [firstTag] = shuffle(selectedGameTags);

  const theme = useTheme();

  return (
    <>
      <Page>
        <Container>
          <Box mb="2rem">
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/shop" component={ReactRouterLink}>
                Shop
              </Link>
              <Link
                color="inherit"
                to={ShopLink.makeCreatorLink(selectedGame)}
                component={ReactRouterLink}
              >
                {selectedGame?.creator}
              </Link>
              <Typography color="textPrimary">{selectedGame?.name}</Typography>
            </Breadcrumbs>
          </Box>
          <ProductDetails
            justifyContent="space-between"
            game={selectedGame}
            color={theme.palette.text.primary}
          />
          <ShopCategory
            name={`You might also like... `}
            tags={firstTag}
            count={5}
          />
          <MoreByCreator creator={selectedGame?.creator} count={5} />
        </Container>
      </Page>
    </>
  );
}

export default ShopCreatorProductRoute;
