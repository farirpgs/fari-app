import ListItem from "@material-ui/core/ListItem";
import React from "react";

export const ListItemLink: React.FC<{}> = props => {
  return <ListItem button component="a" {...props} />;
};
