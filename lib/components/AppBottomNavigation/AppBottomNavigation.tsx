import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CasinoIcon from "@material-ui/icons/Casino";
import LandscapeIcon from "@material-ui/icons/Landscape";
import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";

const _AppBottomNavigation: React.FC<{
  location: { pathname: string };
}> = (props) => {
  return null;
  const [nav, setNav] = useState(0);

  useEffect(() => {
    if (location.pathname.startsWith("/game")) {
      return setNav(1);
    }
    if (location.pathname.startsWith("/play")) {
      return setNav(2);
    }
    if (location.pathname.startsWith("/dice")) {
      return setNav(3);
    } else {
      return setNav(0);
    }
  }, [location.pathname]);

  if (props.location.pathname === "/") {
    return null;
  }
  return (
    <BottomNavigation
      value={nav}
      onChange={(event, newValue) => {
        setNav(newValue);
      }}
      showLabels
      style={{
        zIndex: 1,
        position: "fixed",
        bottom: "0",
        width: "100%",
        left: "0",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      }}
    >
      <BottomNavigationAction
        label="Play"
        component={Link}
        to="/play"
        icon={<LandscapeIcon />}
      />
      <BottomNavigationAction
        label="Dice"
        component={Link}
        to="/dice"
        icon={<CasinoIcon />}
      />
    </BottomNavigation>
  );
};

export const AppBottomNavigation = withRouter(_AppBottomNavigation as any);
