import Container from "@material-ui/core/Container";
import React from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";

export const SrdsRoute: React.FC = (props) => {
  return (
    <Page>
      <Container>
        <ul>
          <li>
            <AppLink to="/srds/condensed">Fate Condensed</AppLink>
          </li>
          <li>
            <AppLink to="/srds/core">Fate Core</AppLink>
          </li>
          <li>
            <AppLink to="/srds/accelerated">Fate Accelerated</AppLink>
          </li>
        </ul>
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";
