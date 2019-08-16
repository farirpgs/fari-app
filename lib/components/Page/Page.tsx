import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React from "react";
import { usePWA } from "../../hooks/usePWA";
import { AppProgress } from "../AppProgress/AppProgress";
import { useDelayedIsLoading } from "./useDelayedIsLoading";

const headerHeightREM = 4.25;
export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;
  h2?: JSX.Element | string;
}> = props => {
  const { isLoading, h1, h2, children } = props;
  const isReallyLoading = useDelayedIsLoading(isLoading);
  const pwa = usePWA();

  return (
    <div>
      {renderHeader()}
      {!isLoading && renderContent()}
    </div>
  );

  function renderContent() {
    return (
      <div className="route-box">
        <div
          style={{
            maxWidth: "1200px",
            margin: `${headerHeightREM + 2}rem auto 0 auto`,
            display: "flex",
            flex: "1 0 auto",
            width: "100%",
            marginBottom: "10rem"
          }}
        >
          <Fade in timeout={250}>
            <div style={{ width: "100%" }}>
              {!!h2 && <h2>{h2}</h2>}
              {!!h2 && <Divider style={{ margin: "1rem 0" }} />}
              {children}
            </div>
          </Fade>
        </div>
      </div>
    );
  }

  function renderHeader() {
    return (
      <>
        <AppBar position="fixed">
          <Toolbar
            style={{
              margin: "0 auto",
              maxWidth: "1200px",
              width: "100%",
              padding: "1rem",
              height: `${headerHeightREM}rem`,
              justifyContent: "space-between"
            }}
          >
            <div className="row between-xs" style={{ width: "100%" }}>
              <div className="col-xs">
                <Typography variant="h6" component="h1">
                  {h1}
                </Typography>
              </div>
            </div>
            {pwa.shouldSuggestInstallation && (
              <div className="col-xs">
                <Fade in>
                  <Button
                    color="inherit"
                    onClick={pwa.prompt}
                    variant="outlined"
                  >
                    <CloudDownloadIcon style={{ marginRight: "1rem" }} />
                    Install
                  </Button>
                </Fade>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {isReallyLoading && (
          <Fade in>
            <div>
              <AppProgress />
            </div>
          </Fade>
        )}
      </>
    );
  }
};
