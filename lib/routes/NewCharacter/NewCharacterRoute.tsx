import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import kebabCase from "lodash/kebabCase";
import startCase from "lodash/startCase";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import {
  CharacterTemplates,
  ICharacterTemplate,
} from "../../domains/character/CharacterType";
import { useQuery } from "../../hooks/useQuery/useQuery";

export function NewCharacterRoute() {
  const charactersManager = useContext(CharactersContext);
  const query = useQuery<"category" | "name">();
  const history = useHistory();
  const [error, setError] = useState(false);

  const categoryFromParams = query.get("category") ?? "";
  const nameFromParam = query.get("name") ?? "";

  useEffect(() => {
    loadAndRedirect();
    async function loadAndRedirect() {
      const template = CharacterTemplates.find((t) => {
        const categoryMatch =
          kebabCase(t.category) === kebabCase(categoryFromParams);
        const nameMatch = kebabCase(t.fileName) === kebabCase(nameFromParam);
        return categoryMatch && nameMatch;
      });
      if (template) {
        const newCharacter = await charactersManager.actions.add(
          template as ICharacterTemplate
        );
        history.replace(`/characters/${newCharacter.id}`);
      } else {
        setError(true);
      }
    }
  }, [categoryFromParams, nameFromParam]);

  function handleOnClose() {
    history.push(`/`);
  }

  return (
    <Page>
      <PageMeta
        title={`"${startCase(
          nameFromParam
        )}" character sheet template, on Fari App`}
        description={`Use the amazing "${startCase(
          nameFromParam
        )}" template and get ready to play!`}
      />
      <Fade in={true}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </Fade>
      <Dialog open={error} onClose={handleOnClose}>
        <DialogTitle>{"Template not found"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The template you are trying to load does not exist.
            <br />
            <br />
            Category: {`"${categoryFromParams}"`}
            <br />
            Name: {`"${nameFromParam}"`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} autoFocus>
            Go to the home page
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default NewCharacterRoute;
