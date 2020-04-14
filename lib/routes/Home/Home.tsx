import { makeStyles, Paper } from "@material-ui/core";
import CasinoIcon from "@material-ui/icons/Casino";
import LandscapeIcon from "@material-ui/icons/Landscape";
import React from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";

const useStyle = makeStyles({
  logo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    transition: "background-color 0.1s ease",
    "&:hover": {
      backgroundColor: "#eaedff",
    },
  },
  icon: {
    width: "4rem",
    height: "4rem",
  },
});

export const Home: React.FC<{}> = (props) => {
  return (
    <Page
      banner={
        <div>
          <h1 style={{ margin: "0 0 1rem 0" }}>Fari</h1>
          <h2>The Role-Playing Game Companion</h2>
        </div>
      }
    >
      <HomeLogos></HomeLogos>
    </Page>
  );
};

export const HomeLogos: React.FC<{}> = (props) => {
  const classes = useStyle(props);
  return (
    <div className="row around-xs">
      <div className="col-xs-6 col-sm-4 margin-2">
        <Paper>
          <AppLink to="/play">
            <div className={classes.logo}>
              <div>
                <LandscapeIcon className={classes.icon}></LandscapeIcon>
              </div>
              <div>Play</div>
            </div>
          </AppLink>
        </Paper>
      </div>
      <div className="col-xs-6 col-sm-4 margin-2">
        <Paper>
          <AppLink to="/dice">
            <div className={classes.logo}>
              <div>
                <CasinoIcon className={classes.icon}></CasinoIcon>
              </div>
              <div>Dice</div>
            </div>
          </AppLink>
        </Paper>
      </div>
    </div>
  );
};
