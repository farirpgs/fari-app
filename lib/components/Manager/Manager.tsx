import { css } from "@emotion/css";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Snackbar from "@material-ui/core/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ExportIcon from "@material-ui/icons/GetApp";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ContentEditablePreview } from "../ContentEditable/ContentEditable";
import { FateLabel } from "../FateLabel/FateLabel";
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
  onDuplicate(item: T): void;
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

  function onDuplicate(item: T) {
    props.onDuplicate(item);
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
      classes={{
        paper: css({
          width: "85%",
          paddingBottom: "6rem",
          maxWidth: isSmall ? undefined : "30rem",
        }),
      }}
    >
      <Snackbar
        open={deletedSnack}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
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
      <Box padding={0.5}>
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              data-cy="manager.new"
              onClick={onAdd}
            >
              {t("manager.new")}
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              data-cy="manager.import"
              component="label"
            >
              {t("manager.import")}
              <input
                type="file"
                accept=".json"
                className={css({
                  display: "none",
                })}
                onChange={(event) => {
                  onImport(event.target.files);
                  event.target.value = "";
                }}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>
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
                  <FateLabel
                    variant="caption"
                    noWrap
                    display="block"
                    className={css({ marginTop: "1rem" })}
                  >
                    {groupName || t("manager.ungrouped")}
                  </FateLabel>
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
                      primary={
                        <ContentEditablePreview value={vm.name} length={30} />
                      }
                      secondary={listItem.formatDate(vm.lastUpdated)}
                    />
                    <ListItemSecondaryAction>
                      <Grid container spacing={1}>
                        <Grid item>
                          <IconButton
                            edge="start"
                            data-cy="manager.export"
                            onClick={() => {
                              onExport(item);
                            }}
                          >
                            <ExportIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            edge="end"
                            data-cy="manager.duplicate"
                            onClick={() => {
                              onDuplicate(item);
                            }}
                          >
                            <FileCopyIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            edge="end"
                            data-cy="manager.delete"
                            onClick={() => {
                              onDelete(item);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </ListItemSecondaryAction>
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
