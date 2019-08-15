import Divider from "@material-ui/core/Divider";
import React from "react";
import { AppProgress } from "../AppProgress/AppProgress";

export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;
  h2?: JSX.Element | string;
  outside?: JSX.Element | string;
}> = props => {
  const { isLoading, h1, h2, outside, children } = props;
  return (
    <div>
      {isLoading && <AppProgress />}
      {outside}
      <div className="route-box">
        {!!h1 && <h1>{h1}</h1>}
        {!!h2 && <h2>{h2}</h2>}

        {!!h1 && <Divider style={{ margin: "1rem 0" }} />}

        {!isLoading && children}
      </div>
    </div>
  );
};
