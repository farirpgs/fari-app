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
import { DataGrid, RowId } from "@material-ui/data-grid";
import produce from "immer";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import {
  CharactersContext,
  ICharacter,
  migrateCharacter,
} from "../../contexts/CharactersContext/CharactersContext";
import {
  ISavableScene,
  migrateScene,
  ScenesContext,
} from "../../contexts/SceneContext/ScenesContext";
import { getDayJs, getDayJSFrom } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

type IRow = {
  id: string;
  name: string;
  group: string;
  type: string;
  lastUpdated: number;
};

export const DataRoute: React.FC = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

  const [selections, setSelection] = useState<Array<RowId>>([]);
  const [importCounter, setImportCounter] = useState(0);
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ group: "", search: "" });

  useEffect(() => {
    const filterDelay = 300;
    const t = setTimeout(() => {
      setFilters({
        search: search,
        group: group,
      });
    }, filterDelay);
    return () => {
      clearTimeout(t);
    };
  }, [search, group]);

  const groups = [
    ...charactersManager.state.groups,
    ...scenesManager.state.groups,
  ];

  const rows = useMemo(() => {
    const originalRows: Array<IRow> = [
      ...charactersManager.state.characters.map((c) => {
        return {
          id: c.id,
          name: c.name,
          group: c.group ?? "Ungrouped",
          lastUpdated: c.lastUpdated,
          type: "Character",
        } as IRow;
      }),
      ...scenesManager.state.scenes.map((s) => {
        return {
          id: s.id,
          name: s.name,
          group: s.group ?? "Ungrouped",
          lastUpdated: s.lastUpdated,
          type: "Scenes",
        } as IRow;
      }),
    ];
    const filteredRows = originalRows
      .filter((r) => {
        if (!filters.group) {
          return true;
        }
        return r.group === filters.group;
      })
      .filter((r) => {
        if (!filters.search) {
          return true;
        }
        return r.name.toLowerCase().includes(filters.search.toLowerCase());
      });
    return filteredRows;
  }, [charactersManager.state.characters, scenesManager.state.scenes, filters]);

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

  function handleOnImport(fileToImport: FileList | null | undefined) {
    FariEntity.import<{
      scenes: Array<ISavableScene>;
      characters: Array<ICharacter>;
    }>({
      filesToImport: fileToImport,
      fariType: "full",
      onImport: (file) => {
        file.characters.forEach((c) => {
          importCharacter(c);
        });
        file.scenes.forEach((s) => {
          importScene(s);
        });
      },
    });
  }

  function importScene(s: ISavableScene) {
    const sceneWithNewId = produce(s, (draft) => {
      draft.id = uuidV4();
    });
    const migratedScene = migrateScene(sceneWithNewId);
    scenesManager.actions.upsert(migratedScene);
  }

  function importCharacter(c: ICharacter) {
    const characterWithNewId = produce(c, (draft) => {
      draft.id = uuidV4();
    });

    const migratedCharacter = migrateCharacter(characterWithNewId);
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
      <Heading title="Data" />

      <Container>
        <Box pb="1rem">
          <Grid container spacing={2} alignItems="baseline">
            <Grid item>
              <TextField
                className={css({ width: "10rem" })}
                helperText="Filter by Name"
                label="Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Grid>
            <Grid>
              <FormControl className={css({ width: "10rem" })}>
                <InputLabel>Group</InputLabel>
                <Select
                  value={group}
                  onChange={(event) => {
                    setGroup(event.target.value as string);
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  {groups.map((g) => {
                    return (
                      <MenuItem value={g} key={g}>
                        {g}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>Filter by Group</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box pb="1rem">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                disabled={!selections.length}
                onClick={() => {
                  handleOnExport();
                }}
              >
                {"Export"}
              </Button>
            </Grid>

            <Grid item>
              <Button color="primary" variant="contained" component="label">
                {t("manager.import")}
                <input
                  type="file"
                  accept=".json"
                  className={css({
                    display: "none",
                  })}
                  onChange={(event) => {
                    handleOnImport(event.target.files);
                    event.target.value = "";
                  }}
                />
              </Button>
            </Grid>
            <Grid item>
              <ThemeProvider theme={errorTheme}>
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={!selections.length}
                  onClick={() => {
                    if (window.confirm("Are you sure ?")) {
                      handleOnDelete();
                    }
                  }}
                >
                  {"Delete"}
                </Button>
              </ThemeProvider>
            </Grid>
          </Grid>
        </Box>
        <Box height="400px">
          <Box display="flex" height="100%">
            <Box flexGrow="1">
              <DataGrid
                rows={rows}
                // showToolbar
                // pageSize={5}
                autoPageSize
                pagination
                checkboxSelection
                onSelectionChange={(newSelection) => {
                  setSelection(newSelection.rowIds);
                }}
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    disableClickEventBubbling: true,
                  },
                  {
                    field: "group",
                    headerName: "Group",
                    width: 150,
                    disableClickEventBubbling: true,
                  },
                  {
                    field: "type",
                    headerName: "Type",
                    width: 150,
                    disableClickEventBubbling: true,
                  },
                  {
                    field: "lastUpdated",
                    headerName: "Last Updated",
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
