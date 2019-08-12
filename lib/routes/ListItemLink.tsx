import ListItem from "@material-ui/core/ListItem";
import React from "react";

export function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
