import React from "react";
import { Page } from "../../components/Page/Page";

import LandscapeIcon from "@material-ui/icons/Landscape";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import CasinoIcon from "@material-ui/icons/Casino";
import { makeStyles, Paper } from "@material-ui/core";
import { AppLink } from "../../components/AppLink/AppLink";

const useStyle = makeStyles({
  logo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontSize: "1.2rem"
  },
  icon: {
    width: "4rem",
    height: "4rem"
  }
});

export const Home: React.FC<{}> = props => {
  return (
    <Page>
      <h1
        style={{
          textAlign: "center",
          background: "#3f50b5",
          color: "#fff",
          margin: "-2rem -2rem 2rem -2rem",
          padding: "2rem"
        }}
      >
        Fari
      </h1>
      <HomeLogos></HomeLogos>
    </Page>
  );
};

export const HomeLogos: React.FC<{}> = props => {
  const classes = useStyle(props);
  return (
    <div className="row around-xs">
      <div className="col-xs-4 col-md-4 margin-2">
        <Paper>
          <AppLink to="/games">
            <div className={classes.logo}>
              <div>
                <GroupAddIcon className={classes.icon}></GroupAddIcon>
              </div>
              <div>Characters</div>
            </div>
          </AppLink>
        </Paper>
      </div>
      <div className="col-xs-4 col-md-4 margin-2">
        <Paper>
          <AppLink to="/scenes">
            <div className={classes.logo}>
              <div>
                <LandscapeIcon className={classes.icon}></LandscapeIcon>
              </div>
              <div>Scenes</div>
            </div>
          </AppLink>
        </Paper>
      </div>
      <div className="col-xs-4 col-md-4 margin-2">
        <Paper>
          <AppLink to="/dice">
            <div className={classes.logo}>
              <div>
                <CasinoIcon className={classes.icon}></CasinoIcon>
              </div>
              <div>Dices</div>
            </div>
          </AppLink>
        </Paper>
      </div>
    </div>
  );
};
