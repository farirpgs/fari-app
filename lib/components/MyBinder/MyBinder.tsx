import { css } from "@emotion/css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FolderIcon from "@mui/icons-material/Folder";
import ExportIcon from "@mui/icons-material/GetApp";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { darken, useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { arraySort } from "../../domains/array/arraySort";
import { LazyState, useLazyState } from "../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ITranslationKeys } from "../../locale";
import { AppLink } from "../AppLink/AppLink";
import { listItem } from "../Manager/domains/ListItem";

// https://dribbble.com/shots/15388627-Global-Search

export type IManagerViewModel = {
  id: string;
  name: string;
  lastUpdated: number;
  group: string | undefined;
  type: string;
  original: any;
};

export type IManagerFolders = Record<string, Array<IManagerViewModel>>;

enum Where {
  Folders,
  Folder,
  Search,
}

export function MyBinder<TFolders extends string>(props: {
  open: boolean;
  onClose(): void;
  folders: IManagerFolders;
  search: string;
  canGoBack: boolean;
  folder: string | undefined;
  onSelect(folder: TFolders, element: IManagerViewModel): void;
  onSelectOnNewTab(folder: TFolders, element: IManagerViewModel): void;
  onNew(folder: TFolders): void;
  onDelete(folder: TFolders, element: IManagerViewModel): void;
  onDuplicate(folder: TFolders, element: IManagerViewModel): void;
  onUndo(folder: TFolders, element: IManagerViewModel): void;
  onImport(
    folder: TFolders,
    importPaths: FileList | null
  ): Promise<{ entity: any | undefined }>;
  onImportAddAsNew(folder: TFolders, entity: any): void;
  onImportUpdateExisting(folder: TFolders, entity: any): void;
  onExport(folder: TFolders, element: IManagerViewModel): void;
  onExportAsTemplate(folder: TFolders, element: IManagerViewModel): void;
}) {
  const { t } = useTranslate();
  const logger = useLogger();
  const theme = useTheme();
  const history = useHistory();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(props.search);
  const [folder, setFolder] = useLazyState({
    value: props.folder,
    delay: 250,
  });

  const [importDialogModalEntity, setImportDialogModalEntity] = useState<any>();

  const [deletedSnack, setDeletedSnack] = useState(false);
  const [deletedObject, setDeletedObject] = useState<
    { folder: TFolders; element: any } | undefined
  >(undefined);

  const currentFolder = folder as TFolders;
  const currentFolderLabel = currentFolder
    ? t(`my-binder.folder.${currentFolder}` as ITranslationKeys)
    : "";

  const currentFolderElements = props.folders[currentFolder] ?? [];
  const currentFolderElementsSorted = arraySort(currentFolderElements, [
    (e) => ({ value: e.lastUpdated, direction: "desc" }),
  ]);
  const latestElements = currentFolderElementsSorted.slice(0, 5);

  const where = getWhere();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [currentFolder]);

  useEffect(
    function clearFolderOnClose() {
      if (props.open === false) {
        setFolder(undefined);
        setSearch("");
      }
    },
    [props.open]
  );

  function handleOnSelect(currentFolder: TFolders, element: IManagerViewModel) {
    props.onSelect(currentFolder, element);
    logger.track("binder.select", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnSelectOnNewTab(
    currentFolder: TFolders,
    element: IManagerViewModel
  ) {
    props.onSelectOnNewTab(currentFolder, element);
    logger.track("binder.select-on-new-tab", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnDelete(currentFolder: TFolders, element: IManagerViewModel) {
    setDeletedObject({ folder: currentFolder, element: element });
    setDeletedSnack(true);
    props.onDelete(currentFolder, element);
    logger.track("binder.delete", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnUndo() {
    if (deletedObject) {
      props.onUndo(deletedObject.folder, deletedObject.element);
      setDeletedObject(undefined);
      setDeletedSnack(false);
    }
  }

  function handleOnDuplicate(
    currentFolder: TFolders,
    element: IManagerViewModel
  ) {
    props.onDuplicate(currentFolder, element);
    logger.track("binder.duplicate", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnExport(currentFolder: TFolders, element: IManagerViewModel) {
    props.onExport(currentFolder, element);
    logger.track("binder.export", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnExportAsTemplate(
    currentFolder: TFolders,
    element: IManagerViewModel
  ) {
    props.onExportAsTemplate(currentFolder, element);
    logger.track("binder.export-as-template", {
      folder: currentFolder,
      name: element.name,
      group: element.group,
    });
  }

  function handleOnGoBack() {
    setFolder(undefined);
    setSearch("");
  }

  async function handleOnImport(event: React.ChangeEvent<HTMLInputElement>) {
    const { entity } = await props.onImport(currentFolder, event.target.files);
    if (entity) {
      setImportDialogModalEntity(entity);
    }
    event.target.value = "";
    logger.track("binder.import", {
      folder: currentFolder,
    });
  }

  function handleOnImportAsNew() {
    props.onImportAddAsNew(currentFolder, importDialogModalEntity);
    setImportDialogModalEntity(undefined);
    logger.track("binder.import-as-new", {
      folder: currentFolder,
    });
  }

  function handleOnImportUpdateExisting() {
    props.onImportUpdateExisting(currentFolder, importDialogModalEntity);
    setImportDialogModalEntity(undefined);
    logger.track("binder.import-update-existing", {
      folder: currentFolder,
    });
  }

  return (
    <>
      <Dialog
        open={!!importDialogModalEntity}
        onClose={() => {
          setImportDialogModalEntity(undefined);
        }}
      >
        <DialogTitle>{t("my-binder.import-dialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("my-binder.import-dialog.description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box mb=".5rem" width="100%">
            <Grid
              container
              wrap="nowrap"
              justifyContent="space-around"
              spacing={2}
            >
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  data-cy={`my-binder.folders.${currentFolder}.import`}
                  size="small"
                  onClick={() => {
                    handleOnImportUpdateExisting();
                  }}
                >
                  {t("my-binder.import-dialog.update-existing")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  data-cy={`my-binder.folders.${currentFolder}.import`}
                  size="small"
                  onClick={() => {
                    handleOnImportAsNew();
                  }}
                >
                  {t("my-binder.import-dialog.add-as-new")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        fullWidth
        maxWidth="md"
        classes={{
          paper: css({
            background: theme.palette.background.default,
            height: "100%",
            position: "relative",
            overflow: "auto",
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
              <Button color="inherit" size="small" onClick={handleOnUndo}>
                {t("manager.undo")}
              </Button>
            }
          >
            {t("manager.deleted")}
          </Alert>
        </Snackbar>
        <Box p="1rem">
          <Paper component="form" elevation={2}>
            <Box px="1rem" py=".5rem" mb="1rem">
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Box mr=".5rem" width="30px">
                    {where === Where.Folders || !props.canGoBack ? (
                      <IconButton size="small" disabled>
                        <MenuBookIcon color="primary" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={handleOnGoBack}>
                        <ArrowBackIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
                <Grid item xs>
                  <LazyState
                    value={search}
                    onChange={(newSearch) => {
                      setSearch(newSearch);
                    }}
                    delay={500}
                    render={([lazySearch, setLazySearch]) => {
                      return (
                        <InputBase
                          placeholder={
                            folder
                              ? `${t(
                                  "my-binder.search-in"
                                )} "${currentFolderLabel}"...`
                              : t("my-binder.search")
                          }
                          inputRef={searchInputRef}
                          value={lazySearch}
                          fullWidth
                          onChange={(e) => {
                            setLazySearch(e.target.value);
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item>
                  <SearchIcon className={css({ display: "flex" })} />
                </Grid>
              </Grid>
            </Box>
          </Paper>
          {where === Where.Folders && (
            <Fade in key="renderFolders">
              <Box>{renderFolders()}</Box>
            </Fade>
          )}
          {where === Where.Folder && (
            <Fade in key="renderFolder">
              <Box>{renderFolder()}</Box>
            </Fade>
          )}
          {where === Where.Search && (
            <Fade in key="renderSearch">
              <Box>{renderSearch()}</Box>
            </Fade>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <AppLink
                onClick={() => {
                  history.push("/data");
                  props.onClose();
                }}
              >
                {t("my-binder.all-my-data")}
              </AppLink>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );

  function renderFolders() {
    const folderNames = Object.keys(props.folders);
    return (
      <Box>
        <List>
          {folderNames.map((name, key) => {
            const folderItemCount = props.folders[name].length;
            const translatedFolderName = t(
              `my-binder.folder.${name}` as ITranslationKeys
            );
            return (
              <ListItem
                key={key}
                button
                data-cy={`my-binder.folders.${name}`}
                onClick={() => {
                  setFolder(name);
                }}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      {translatedFolderName}{" "}
                      <span
                        className={css({ color: theme.palette.text.secondary })}
                      >
                        ({folderItemCount})
                      </span>
                    </span>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  }

  function renderFolder() {
    return (
      <Box>
        <Box>
          <Box mb="1rem">
            <Grid container justifyContent="center" spacing={1}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  data-cy={`my-binder.folders.${currentFolder}.new`}
                  onClick={() => {
                    props.onNew(currentFolder);
                    logger.track("binder.new", {
                      folder: currentFolder,
                    });
                  }}
                >
                  {t("my-binder.elements.new")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  data-cy={`my-binder.folders.${currentFolder}.import`}
                  size="small"
                  component="label"
                >
                  {t("menu.elements.import")}
                  <input
                    type="file"
                    accept=".json"
                    className={css({
                      display: "none",
                    })}
                    onChange={(event) => {
                      handleOnImport(event);
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box>{renderLatestElements()}</Box>
          <Box>{renderElements(currentFolderElements)}</Box>
        </Box>
      </Box>
    );
  }

  function renderSearch() {
    const allElements = folder
      ? props.folders[folder]
      : Object.keys(props.folders).flatMap((folderName) => {
          return props.folders[folderName];
        });
    const searchElements = allElements.filter((e) => {
      const nameLower = e.name.toLowerCase();
      const groupLower = e.group?.toLowerCase() ?? "";
      const searchLower = search.toLowerCase();
      if (nameLower.includes(searchLower) || groupLower.includes(searchLower)) {
        return true;
      }
      return false;
    });
    return (
      <Box>
        <Box>{renderElements(searchElements, true)}</Box>
      </Box>
    );
  }

  function renderLatestElements() {
    return (
      <Box>
        {latestElements.length > 0 &&
          renderHeader("Latest", latestElements.length)}
        <List dense>
          {latestElements.map((element) => {
            const type = element.type as TFolders;
            return (
              <React.Fragment key={element.id}>
                <Element
                  element={element}
                  displayType={false}
                  onSelect={() => {
                    handleOnSelect(type, element);
                  }}
                  onSelectOnNewTab={() => {
                    handleOnSelectOnNewTab(type, element);
                  }}
                  onDelete={() => {
                    handleOnDelete(type, element);
                  }}
                  onDuplicate={() => {
                    handleOnDuplicate(type, element);
                  }}
                  onExport={() => {
                    handleOnExport(type, element);
                  }}
                  onExportAsTemplate={() => {
                    handleOnExportAsTemplate(type, element);
                  }}
                />
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    );
  }

  function renderElements(elements: IManagerViewModel[], displayType = false) {
    const groups = elements.reduce((acc, curr) => {
      const group = curr.group || "Other";
      const currentList = acc[group] ?? [];
      return {
        ...acc,
        [group]: [...currentList, curr],
      };
    }, {} as Record<string, Array<IManagerViewModel>>);

    const groupNames = arraySort(Object.keys(groups), [
      (g) => ({ value: g !== "Other", direction: "asc" }),
      (g) => ({ value: g, direction: "asc" }),
    ]);

    return (
      <Box>
        {groupNames.length === 0 && (
          <Grid container justifyContent="center">
            <Grid item>
              <Box my="2rem">
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Box mb="1rem">
                    <Typography variant="subtitle2" color="textSecondary">
                      {t("my-binder.folder.empty")}
                    </Typography>
                  </Box>
                  <Box>
                    <MenuBookIcon
                      className={css({
                        color: theme.palette.text.secondary,
                        width: "5rem",
                        height: "5rem",
                      })}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        {groupNames.map((groupName, key) => {
          const groupItems = groups[groupName];
          const sortedGroupItems = arraySort(groupItems, [
            (e) => ({ value: e.lastUpdated, direction: "desc" }),
          ]).filter((e) => {
            const isntInLatestElements =
              latestElements.find((le) => le.id === e.id) === undefined;
            return isntInLatestElements;
          });

          if (sortedGroupItems.length === 0) {
            return null;
          }
          return (
            <Box key={key}>
              {renderHeader(groupName, groupItems.length)}
              <List dense>
                {sortedGroupItems.map((element) => {
                  const type = element.type as TFolders;
                  return (
                    <React.Fragment key={element.id}>
                      <Element
                        element={element}
                        displayType={displayType}
                        onSelect={() => {
                          handleOnSelect(type, element);
                        }}
                        onSelectOnNewTab={() => {
                          handleOnSelectOnNewTab(type, element);
                        }}
                        onDelete={() => {
                          handleOnDelete(type, element);
                        }}
                        onDuplicate={() => {
                          handleOnDuplicate(type, element);
                        }}
                        onExport={() => {
                          handleOnExport(type, element);
                        }}
                        onExportAsTemplate={() => {
                          handleOnExportAsTemplate(type, element);
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    );
  }

  function renderHeader(title: string, length: number) {
    return (
      <ListSubheader
        className={css({
          padding: "0",
        })}
      >
        <Box
          px="1rem"
          className={css({
            background:
              theme.palette.mode === "light"
                ? darken(theme.palette.background.default, 0.03)
                : theme.palette.background.paper,
          })}
        >
          <Box>
            <span
              className={css({
                fontWeight: theme.typography.fontWeightBold,

                color: theme.palette.text.primary,
              })}
            >
              {title}{" "}
            </span>
            <span
              className={css({
                color: theme.palette.text.secondary,
              })}
            >
              {`(${length})`}
            </span>
          </Box>
        </Box>
      </ListSubheader>
    );
  }
  function getWhere() {
    if (search !== "") {
      return Where.Search;
    }
    if (!!folder) {
      return Where.Folder;
    }
    return Where.Folders;
  }
}

function Element(props: {
  element: IManagerViewModel;
  displayType: boolean;
  onSelect(): void;
  onSelectOnNewTab(): void;
  onExport(): void;
  onExportAsTemplate(): void;
  onDuplicate(): void;
  onDelete(): void;
}) {
  const { t } = useTranslate();
  const theme = useTheme();
  const abrev = listItem.getAbreviation(props.element.name);
  const backgroundColor = listItem.getColor(props.element.name);
  const color = theme.palette.getContrastText(backgroundColor);
  const [hover, setHover] = useState(false);

  const iconButtonClassName = css({
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shortest,
    }),
    color: hover ? theme.palette.text.primary : theme.palette.text.secondary,
  });
  const translatedType = props.displayType
    ? t(`my-binder.folder.${props.element.type}` as ITranslationKeys)
    : undefined;

  return (
    <ListItem
      button
      onPointerEnter={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
      onClick={(event) => {
        if (event.ctrlKey || event.metaKey) {
          props.onSelectOnNewTab();
        } else {
          props.onSelect();
        }
      }}
      onMouseDown={(event) => {
        if (event.button === 1) {
          props.onSelectOnNewTab();
        }
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
      <ListItemText primary={props.element.name} secondary={translatedType} />

      <ListItemSecondaryAction>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <span className={css({ color: theme.palette.text.secondary })}>
              ({listItem.formatDate(props.element.lastUpdated)})
            </span>
          </Grid>
          <Grid item>
            <Tooltip title={t("my-binder.element.export")}>
              <IconButton
                size="small"
                data-cy={`my-binder.element.${props.element.name}.export`}
                className={iconButtonClassName}
                onPointerEnter={() => {
                  setHover(true);
                }}
                onPointerLeave={() => {
                  setHover(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onExport();
                }}
              >
                <ExportIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title={t("my-binder.element.export-as-template")}>
              <IconButton
                size="small"
                data-cy={`my-binder.element.${props.element.name}.export-as-template`}
                className={iconButtonClassName}
                onPointerEnter={() => {
                  setHover(true);
                }}
                onPointerLeave={() => {
                  setHover(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onExportAsTemplate();
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title={t("my-binder.element.duplicate")}>
              <IconButton
                size="small"
                data-cy={`my-binder.element.${props.element.name}.duplicate`}
                className={iconButtonClassName}
                onPointerEnter={() => {
                  setHover(true);
                }}
                onPointerLeave={() => {
                  setHover(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDuplicate();
                }}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title={t("my-binder.element.delete")}>
              <IconButton
                size="small"
                data-cy={`my-binder.element.${props.element.name}.delete`}
                className={iconButtonClassName}
                onPointerEnter={() => {
                  setHover(true);
                }}
                onPointerLeave={() => {
                  setHover(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDelete();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
