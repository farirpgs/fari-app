import { Divider, Paper } from "@material-ui/core";
import React from "react";
import { Banner } from "../../components/Banner/Banner";
import { Page } from "../../components/Page/Page";
export function NotFoundRoute(props) {
  return (
    <div>
      <Page isLoading={false}>
        <Banner variant="warning">
          <Paper style={{ padding: "2rem" }}>
            <div className="h2">There is no war in Ba Sing Se</div>

            <p>The page you are trying to access doesn't exist.</p>
            <Divider className="margin-1"></Divider>
            <p>Use the bottom menu to get out of the woods</p>
          </Paper>
        </Banner>
      </Page>
    </div>
  );
}
