import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
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
      {isLoading && (
        <Fade in>
          <AppProgress />
        </Fade>
      )}
      {outside}
      <div className="route-box">
        {!isLoading && (
          <Fade in>
            <div>
              {!!h1 && <h1>{h1}</h1>}
              {!!h2 && <h2>{h2}</h2>}

              {!!h1 && <Divider style={{ margin: "1rem 0" }} />}

              {children}
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};
