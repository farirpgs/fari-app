import React from "react";
import { Page } from "../../components/Page/Page";

import LandscapeIcon from "@material-ui/icons/Landscape";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import CasinoIcon from "@material-ui/icons/Casino";
import { makeStyles, Paper } from "@material-ui/core";
import { AppLink } from "../../components/AppLink/AppLink";

const useStyle = makeStyles({
  logos: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  logo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontSize: "1.2rem"
  },
  icon: {
    width: "6rem",
    height: "6rem"
  }
});

export const Home: React.FC<{}> = props => {
  const classes = useStyle(props);
  return (
    <Page>
      <div className={classes.logos}>
        <Paper className="margin-2">
          <AppLink to="/games">
            <div className={classes.logo}>
              <div>
                <GroupAddIcon className={classes.icon}></GroupAddIcon>
              </div>
              <div>Characters</div>
            </div>
          </AppLink>
        </Paper>
        <Paper className="margin-2">
          <AppLink to="/scenes">
            <div className={classes.logo}>
              <div>
                <LandscapeIcon className={classes.icon}></LandscapeIcon>
              </div>
              <div>Scenes</div>
            </div>
          </AppLink>
        </Paper>
        <Paper className="margin-2">
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
    </Page>
  );
};
