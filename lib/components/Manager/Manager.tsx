import {
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import { css } from "emotion";
import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { listItem } from "./domains/ListItem";

type IBaseItem = {};

type IProps<T extends IBaseItem> = {
  list: Array<T>;
  open: boolean;
  getViewModel(item: T): { id: string; name: string; lastUpdated: number };
  onClose(): void;
  onItemClick(item: T): void;
  onAdd(): void;
  onDelete(item: T): void;
  onUndo(item: T): void;
};

export const Manager = <T extends IBaseItem>(props: IProps<T>) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [deletedSnack, setDeletedSnack] = useState(false);
  const [deletedObject, setDeletedObject] = useState<T | undefined>(undefined);
  const { t } = useTranslate();

  function onAdd() {
    props.onAdd();
  }
  function onItemClick(item: T) {
    props.onItemClick(item);
  }

  function onUndo() {
    if (deletedObject) {
      props.onUndo(deletedObject);
      setDeletedObject(undefined);
    }
  }

  function onDelete(item: T) {
    setDeletedObject(item);
    setDeletedSnack(true);
    props.onDelete(item);
  }

  return (
    <Drawer
      anchor={"left"}
      open={props.open}
      onClose={props.onClose}
      className={css({
        width: isSmall ? "100%" : "30%",
      })}
    >
      <Snackbar
        open={deletedSnack}
        autoHideDuration={6000}
        onClose={() => {
          setDeletedSnack(false);
        }}
      >
        <Alert
          onClose={() => {
            setDeletedSnack(false);
          }}
          severity="success"
          action={
            <Button color="inherit" size="small" onClick={onUndo}>
              {t("manager.undo")}
            </Button>
          }
        >
          {t("manager.deleted")}
        </Alert>
      </Snackbar>
      <Box pt="1rem">
        {renderActions()}
        {renderNoItems()}
        {renderItems()}
      </Box>
    </Drawer>
  );

  function renderActions() {
    return (
      <Grid container spacing={1} justify="center">
        <Grid item>
          <Button color="primary" variant="outlined" onClick={onAdd}>
            {t("manager.new")}
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderNoItems() {
    if (props.list.length) {
      return null;
    }

    return (
      <Box p="1rem">
        <Alert severity="info">{t("manager.no-items")}</Alert>
      </Box>
    );
  }

  function renderItems() {
    if (!props.list.length) {
      return null;
    }

    return (
      <List>
        {props.list.map((item) => {
          const itemVM = props.getViewModel(item);
          const abrev = listItem.getAbreviation(itemVM.name);
          const backgroundColor = listItem.getColor(abrev);
          const color = theme.palette.getContrastText(backgroundColor);

          return (
            <ListItem
              button
              key={itemVM.id}
              onClick={() => {
                onItemClick(item);
              }}
            >
              <ListItemAvatar>
                <Avatar
                  className={css({
                    color: color,
                    backgroundColor: backgroundColor,
                  })}
                >
                  {abrev}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={itemVM.name}
                secondary={listItem.formatDate(itemVM.lastUpdated)}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => {
                    onDelete(item);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
  }
};

Manager.displayName = "Manager";
