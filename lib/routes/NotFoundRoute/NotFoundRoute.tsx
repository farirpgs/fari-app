import React from "react";
import { Page } from "../../components/Page/Page";
export function NotFoundRoute(props) {
  return (
    <div>
      <Page isLoading={false}>
        <div className="h2">There is no war in Ba Sing Se</div>

        <p>The page you are trying to access doesn&apos;t exist.</p>
        <p>Use the bottom menu to get out of the woods</p>
      </Page>
    </div>
  );
}
