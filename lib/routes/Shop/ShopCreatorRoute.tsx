import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import kebabCase from "lodash/kebabCase";
import React from "react";
import { useRouteMatch } from "react-router";
import { Link as ReactRouterLink } from "react-router-dom";
import { Page } from "../../components/Page/Page";
import { MoreByCreator } from "./components/MoreByCreator";
import { games } from "./games/games";

export function ShopCreatorRoute() {
  const match = useRouteMatch<{ creatorSlug: string }>();

  const creatorsGames = games.filter((g) => {
    const creatorSlug = kebabCase(g.creator);

    return match.params.creatorSlug === creatorSlug;
  });
  const [firstGame] = creatorsGames;

  return (
    <>
      <Page>
        <Container>
          <Box mb="2rem">
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/shop" component={ReactRouterLink}>
                Shop
              </Link>

              <Typography color="textPrimary">{firstGame.creator}</Typography>
            </Breadcrumbs>
          </Box>
          <MoreByCreator creator={firstGame.creator} />
        </Container>
      </Page>
    </>
  );
}

export default ShopCreatorRoute;
