import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import { DataGrid, RowId } from "@material-ui/data-grid";
import produce from "immer";
import React, { useContext, useState } from "react";
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
import { dayJS, getDayJSFrom } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/FariEntity/FariEntity";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

type IRow = {
  id: string;
  title: string;
  group: string;
  type: string;
  lastUpdated: number;
};

export const DataRoute: React.FC = (props) => {
  const { t } = useTranslate();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);
  const [selections, setSelection] = useState<Array<RowId>>([]);
  const [importCounter, setImportCounter] = useState(0);
  const theme = useTheme();
  const errorTheme = useButtonTheme(theme.palette.error.main);

  const exportRows: Array<IRow> = [
    ...charactersManager.state.characters.map((c) => {
      return {
        id: c.id,
        title: c.name,
        group: c.group ?? "Ungrouped",
        lastUpdated: c.lastUpdated,
        type: "Character",
      } as IRow;
    }),
    ...scenesManager.state.scenes.map((s) => {
      return {
        id: s.id,
        title: s.name,
        group: s.group ?? "Ungrouped",
        lastUpdated: s.lastUpdated,
        type: "Scenes",
      } as IRow;
    }),
  ];

  function handleOnExport() {
    const charactersToExport = charactersManager.state.characters.filter((s) =>
      selections.includes(s.id)
    );
    const scenesToExport = scenesManager.state.scenes.filter((c) =>
      selections.includes(c.id)
    );

    FariEntity.export({
      fariType: "batch",
      name: `data-${dayJS().format("YYYY-MM-DD")}`,
      element: {
        scenes: scenesToExport,
        characters: charactersToExport,
      },
    });
  }

  function handleOnImport(fileToImport: FileList | null) {
    FariEntity.import<{
      scenes: Array<ISavableScene>;
      characters: Array<ICharacter>;
    }>({
      filesToImport: fileToImport,
      fariType: "batch",
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

  return (
    <Page>
      <Heading title="Data" />

      <Container>
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
                  key={`import-input-${importCounter}`}
                  className={css({
                    display: "none",
                  })}
                  onChange={(event) => {
                    handleOnImport(event.target.files);
                    setImportCounter((prev) => prev + 1);
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
                rows={exportRows}
                showToolbar
                columns={[
                  {
                    field: "title",
                    headerName: "Name",
                    flex: 1,
                    disableClickEventBubbling: true,
                  },
                  { field: "group", headerName: "Group", width: 150 },
                  { field: "type", headerName: "Type", width: 150 },
                  {
                    field: "lastUpdated",
                    headerName: "Last Updated",
                    width: 250,
                    valueGetter: (cell) => {
                      return getDayJSFrom(cell.value as number).format("lll");
                    },
                  },
                ]}
                // pageSize={5}
                autoPageSize
                pagination
                checkboxSelection
                onSelectionChange={(newSelection) => {
                  setSelection(newSelection.rowIds);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};

export default DataRoute;
