import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { DataGrid, GridRowId } from "@material-ui/data-grid";
import produce from "immer";
import uniq from "lodash/uniq";
import React, { useContext, useMemo, useRef, useState } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { SplitButton } from "../../components/SplitButton/SplitButton";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import {
  ISavableScene,
  ScenesContext,
} from "../../contexts/SceneContext/ScenesContext";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { ICharacter } from "../../domains/character/types";
import { getDayJs, getDayJSFrom } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useLazyState } from "../../hooks/useLazyState/useLazyState";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

enum ImportMode {
  Import = "Import",
  ImportAndDuplicate = "ImportAndDuplicate",
}

type IRow = {
  id: string;
  entity: any;
  name: string;
  group: string;
  type: string;
  lastUpdated: number;
  size: number;
};

export const DataRoute: React.FC = () => {
  const { t } = useTranslate();
  const DataRouteItemType = {
    Character: t("data-route.item-type.character"),
    Scene: t("data-route.item-type.scene"),
  };
  const DataRouteItemTypeList = [
    DataRouteItemType.Character,
    DataRouteItemType.Scene,
  ];

  const theme = useTheme();
  const errorTheme = useThemeFromColor(theme.palette.error.main);
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

  const [selections, setSelection] = useState<Array<GridRowId>>([]);
  const $importInput = useRef<any>();
  const $importAndDuplicateInput = useRef<any>();
  const [filters, setFilters] = useState({ group: "", search: "", type: "" });
  const [group, setGroup] = useLazyState({
    value: "",
    delay: 750,
    onChange(newGroup) {
      setFilters((draft) => {
        return { ...draft, group: newGroup };
      });
    },
  });

  const [type, setType] = useLazyState({
    value: "",
    delay: 750,
    onChange(newType) {
      setFilters((draft) => {
        return { ...draft, type: newType };
      });
    },
  });
  const [search, setSearch] = useLazyState({
    value: "",
    delay: 750,
    onChange(newSearch) {
      setFilters((draft) => {
        return { ...draft, search: newSearch };
      });
    },
  });

  const groups = uniq([
    ...charactersManager.state.groups,
    ...scenesManager.state.groups,
  ]);

  const { filteredRows, allRows, size } = useMemo(() => {
    const allRows: Array<IRow> = [
      ...charactersManager.state.characters.map((c) => {
        return {
          id: c.id,
          entity: c,
          name: previewContentEditable({ value: c.name }),
          group: c.group ?? "-",
          lastUpdated: c.lastUpdated,
          type: DataRouteItemType.Character,
          size: FariEntity.getSize(c).kiloBytes,
        } as IRow;
      }),
      ...scenesManager.state.scenes.map((s) => {
        return {
          id: s.id,
          entity: s,
          name: previewContentEditable({ value: s.name }),
          group: s.group ?? "-",
          lastUpdated: s.lastUpdated,
          type: DataRouteItemType.Scene,
          size: FariEntity.getSize(s).kiloBytes,
        } as IRow;
      }),
    ];
    const filteredRows = allRows
      .filter((r) => {
        if (!filters.group) {
          return true;
        }
        return r.group === filters.group;
      })
      .filter((r) => {
        if (!filters.type) {
          return true;
        }
        return r.type === filters.type;
      })
      .filter((r) => {
        if (!filters.search) {
          return true;
        }
        return r.name.toLowerCase().includes(filters.search.toLowerCase());
      });
    const allRowsSize = FariEntity.getSize(
      allRows.map((r) => r.entity)
    ).kiloBytes;

    return {
      filteredRows: filteredRows,
      allRows: allRows,
      size: allRowsSize,
    };
  }, [charactersManager.state.characters, scenesManager.state.scenes, filters]);

  const selectedRowsSize = useMemo(() => {
    const rows = allRows.filter((r) => {
      return selections.includes(r.id);
    });

    return FariEntity.getSize(rows).kiloBytes;
  }, [allRows, selections]);

  function handleOnExport() {
    const charactersToExport = charactersManager.state.characters.filter((s) =>
      selections.includes(s.id)
    );
    const scenesToExport = scenesManager.state.scenes.filter((c) =>
      selections.includes(c.id)
    );

    FariEntity.export({
      fariType: "full",
      name: `${getDayJs().format("YYYY-MM-DD")}`,
      element: {
        scenes: scenesToExport,
        characters: charactersToExport,
      },
    });
  }

  function handleOnImport(
    fileToImport: FileList | null | undefined,
    mode: ImportMode
  ) {
    FariEntity.import<{
      scenes: Array<ISavableScene>;
      characters: Array<ICharacter>;
    }>({
      filesToImport: fileToImport,
      fariType: "full",
      onImport: (file) => {
        file.characters.forEach((c) => {
          importCharacter(c, mode);
        });
        file.scenes.forEach((s) => {
          importScene(s, mode);
        });
      },
    });
    FariEntity.import<ICharacter>({
      filesToImport: fileToImport,
      fariType: "character",
      onImport: (character) => {
        importCharacter(character, mode);
      },
    });
    FariEntity.import<ISavableScene>({
      filesToImport: fileToImport,
      fariType: "scene",
      onImport: (scene) => {
        importScene(scene, mode);
      },
    });
  }

  function importScene(scene: ISavableScene, mode: ImportMode) {
    const sceneToUse =
      mode === ImportMode.Import
        ? scene
        : produce(scene, (draft) => {
            draft.id = Id.generate();
          });
    const migratedScene = SceneFactory.migrate(sceneToUse);
    scenesManager.actions.upsert(migratedScene);
  }

  function importCharacter(character: ICharacter, mode: ImportMode) {
    const characterToUse =
      mode === ImportMode.Import
        ? character
        : produce(character, (draft) => {
            draft.id = Id.generate();
          });

    const migratedCharacter = CharacterFactory.migrate(characterToUse);
    charactersManager.actions.upsert(migratedCharacter);
  }

  function handleOnDelete() {
    const charactersToExport = charactersManager.state.characters.filter((s) =>
      selections.includes(s.id)
    );
    const scenesToExport = scenesManager.state.scenes.filter((c) =>
      selections.includes(c.id)
    );

    charactersToExport.forEach((c) => {
      charactersManager.actions.remove(c.id);
    });
    scenesToExport.forEach((s) => {
      scenesManager.actions.remove(s.id);
    });
  }

  return (
    <Page>
      <PageMeta
        title={t("data-route.meta.title")}
        description={t("data-route.meta.description")}
      />
      <Heading
        title={t("data-route.meta.title")}
        subtitle={t("data-route.meta.description")}
      />
      <Container>
        <Box pb="1rem">
          <Grid container spacing={2} alignItems="baseline">
            <Grid item>
              <TextField
                className={css({ width: "10rem" })}
                helperText={t("data-route.filter-by-name")}
                label={t("data-route.name")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <FormControl className={css({ width: "10rem" })}>
                <InputLabel>{t("data-route.group")}</InputLabel>
                <Select
                  value={group}
                  onChange={(event) => {
                    setGroup(event.target.value as string);
                  }}
                >
                  <MenuItem value="">{t("data-route.none")}</MenuItem>
                  {groups.map((g) => {
                    return (
                      <MenuItem value={g} key={g}>
                        {g}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>
                  {t("data-route.filter-by-group")}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={css({ width: "10rem" })}>
                <InputLabel>{t("data-route.type")}</InputLabel>
                <Select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value as string);
                  }}
                >
                  <MenuItem value="">{t("data-route.none")}</MenuItem>
                  {DataRouteItemTypeList.map((t) => {
                    return (
                      <MenuItem value={t} key={t}>
                        {t}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>
                  {t("data-route.filter-by-type")}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box pb="1rem">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                disabled={!selections.length}
                onClick={() => {
                  handleOnExport();
                }}
              >
                {t("data-route.export")}
              </Button>
            </Grid>

            <Grid item>
              <SplitButton
                color="primary"
                variant="outlined"
                options={[
                  {
                    label: t("data-route.import"),
                    onClick: () => {
                      $importInput.current.click();
                    },
                  },
                  {
                    label: t("data-route.import-and-duplicate"),
                    onClick: () => {
                      $importAndDuplicateInput.current.click();
                    },
                  },
                ]}
              />

              <input
                ref={$importInput}
                type="file"
                accept=".json"
                className={css({
                  display: "none",
                })}
                onChange={(event) => {
                  handleOnImport(event.target.files, ImportMode.Import);
                  event.target.value = "";
                }}
              />
              <input
                ref={$importAndDuplicateInput}
                type="file"
                accept=".json"
                className={css({
                  display: "none",
                })}
                onChange={(event) => {
                  handleOnImport(
                    event.target.files,
                    ImportMode.ImportAndDuplicate
                  );
                  event.target.value = "";
                }}
              />
            </Grid>

            <Grid item>
              <ThemeProvider theme={errorTheme}>
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!selections.length}
                  onClick={() => {
                    if (window.confirm(t("data-route.delete-confirmation"))) {
                      handleOnDelete();
                    }
                  }}
                >
                  {t("data-route.delete")}
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item>
              {t("data-route.total-size")}
              {": "}
              {FariEntity.formatSize(size)}
              {selections.length > 0 && (
                <>
                  {" "}
                  ({t("data-route.selected-size")}
                  {": "}
                  {FariEntity.formatSize(selectedRowsSize)})
                </>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box height="400px">
          <Box display="flex" height="100%">
            <Box flexGrow="1">
              <DataGrid
                rows={filteredRows}
                // showToolbar
                // pageSize={5}
                autoPageSize
                pagination
                checkboxSelection
                onSelectionModelChange={(newSelection) => {
                  setSelection(newSelection.selectionModel);
                }}
                columns={[
                  {
                    field: "name",
                    headerName: t("data-route.name"),
                    flex: 1,
                    disableClickEventBubbling: true,
                  },
                  {
                    field: "group",
                    headerName: t("data-route.group"),
                    width: 150,
                    disableClickEventBubbling: true,
                  },
                  {
                    field: "type",
                    headerName: t("data-route.type"),
                    width: 150,
                    disableClickEventBubbling: true,
                    renderCell: (params) => {
                      return <strong>{params.value}</strong>;
                    },
                  },
                  {
                    field: "size",
                    headerName: t("data-route.size"),
                    width: 150,
                    disableClickEventBubbling: true,
                    renderCell: (params) => {
                      const kiloBytes = params.value as number;
                      const formatted = FariEntity.formatSize(kiloBytes);

                      return <>{formatted}</>;
                    },
                  },
                  {
                    field: "lastUpdated",
                    headerName: t("data-route.last-updated"),
                    width: 250,
                    disableClickEventBubbling: true,
                    valueGetter: (cell) => {
                      return getDayJSFrom(cell.value as number).format("lll");
                    },
                  },
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};

export default DataRoute;
