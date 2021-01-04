import Container from "@material-ui/core/Container";
import React from "react";
import { Link } from "react-router-dom";
import { Page } from "../../components/Page/Page";

export const SrdsRoute: React.FC = (props) => {
  return (
    <Page>
      <Container>
        <ul>
          <li>
            <Link to="/srds/condensed">Fate Condensed</Link>
          </li>
          <li>
            <Link to="/srds/core">Fate Core</Link>
          </li>
          <li>
            <Link to="/srds/accelerated">Fate Accelerated</Link>
          </li>
        </ul>
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";
