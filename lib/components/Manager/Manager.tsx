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
  ListSubheader,
  Snackbar,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExportIcon from "@material-ui/icons/GetApp";
import { Alert } from "@material-ui/lab";
import { css } from "emotion";
import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { listItem } from "./domains/ListItem";

export enum ManagerMode {
  Manage,
  Use,
  Close,
}

type IBaseItem = {};

type IManagerViewModel = {
  id: string;
  name: string;
  lastUpdated: number;
  group: string | undefined;
};

type IProps<T extends IBaseItem> = {
  list: Array<T>;
  mode: ManagerMode;
  getViewModel(item: T): IManagerViewModel;
  onClose(): void;
  onItemClick(item: T): void;
  onAdd(): void;
  onDelete(item: T): void;
  onUndo(item: T): void;
  onImport(importPaths: FileList | null): void;
  onExport(item: T): void;
};

export const Manager = <T extends IBaseItem>(props: IProps<T>) => {
  type IGroupedItem = {
    item: T;
    vm: IManagerViewModel;
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [deletedSnack, setDeletedSnack] = useState(false);
  const [deletedObject, setDeletedObject] = useState<T | undefined>(undefined);
  const [importCounter, setImportCounter] = useState(0);

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
      setDeletedSnack(false);
    }
  }

  function onDelete(item: T) {
    setDeletedObject(item);
    setDeletedSnack(true);
    props.onDelete(item);
  }

  function onImport(itemsToImport: FileList | null) {
    props.onImport(itemsToImport);
  }

  function onExport(item: T) {
    props.onExport(item);
  }

  return (
    <Drawer
      anchor={"left"}
      open={props.mode !== ManagerMode.Close}
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
    if (props.mode !== ManagerMode.Manage) {
      return null;
    }
    return (
      <Grid container spacing={1} justify="center">
        <Grid item>
          <Button color="primary" variant="outlined" onClick={onAdd}>
            {t("manager.new")}
          </Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant="outlined" component="label">
            {t("manager.import")}
            <input
              type="file"
              accept=".json"
              key={`import-input-${importCounter}`}
              className={css({
                display: "none",
              })}
              onChange={(event) => {
                onImport(event.target.files);
                setImportCounter((prev) => prev + 1);
              }}
            />
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

    const groups = props.list
      .map(
        (i): IGroupedItem => {
          return { item: i, vm: props.getViewModel(i) };
        }
      )
      .reduce((prev, curr) => {
        const group = curr.vm.group || "";
        const currentList = prev[group] ?? [];
        return {
          ...prev,
          [group]: [...currentList, curr],
        };
      }, {} as Record<string, Array<IGroupedItem>>);

    return (
      <>
        {Object.keys(groups).map((groupName, index) => {
          const groupItems = groups[groupName];

          return (
            <List
              key={`${groupName}-${index}`}
              subheader={
                <ListSubheader component="div">
                  {groupName || "Ungrouped"}
                </ListSubheader>
              }
            >
              {groupItems.map((element) => {
                const { item, vm: vm } = element;
                const abrev = listItem.getAbreviation(vm.name);
                const backgroundColor = listItem.getColor(abrev);
                const color = theme.palette.getContrastText(backgroundColor);

                return (
                  <ListItem
                    button
                    key={vm.id}
                    onClick={() => {
                      onItemClick(item);
                    }}
                    className={css({
                      paddingRight: "102px",
                    })}
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
                      primary={vm.name}
                      secondary={listItem.formatDate(vm.lastUpdated)}
                    />
                    {props.mode === ManagerMode.Manage && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="start"
                          onClick={() => {
                            onExport(item);
                          }}
                        >
                          <ExportIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            onDelete(item);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                );
              })}
            </List>
          );
        })}
      </>
    );
  }
};

Manager.displayName = "Manager";
