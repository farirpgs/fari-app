import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormHelperText,
  Link,
} from "@mui/material";
import kebabCase from "lodash/kebabCase";
import startCase from "lodash/startCase";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import {
  CharacterTemplates,
  ICharacterTemplate,
} from "../../domains/character/CharacterType";
import { ICharacter } from "../../domains/character/types";
import { CharacterV3Dialog } from "../Character/components/CharacterDialog/CharacterV3Dialog";

export function NewCharacterRoute() {
  const charactersManager = useContext(CharactersContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [template, setTemplate] = useState<ICharacterTemplate>();
  const params = useParams<{
    category: string;
    name: string;
  }>();
  const templateCategoryLabel = startCase(params.category);
  const templateNameLabel = startCase(params.name);

  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const isLoading = status === "loading";

  useEffect(() => {
    load();
    async function load() {
      const template = CharacterTemplates.find((t) => {
        const categoryMatch =
          kebabCase(t.category.toLowerCase()) ===
          kebabCase(params.category?.toLowerCase());
        const nameMatch =
          kebabCase(t.fileName.toLowerCase()) ===
          kebabCase(params.name?.toLowerCase());
        return categoryMatch && nameMatch;
      });
      if (template) {
        const fake = await CharacterFactory.make(template);
        setFakeCharacter(fake);
        setTemplate(template);
        setStatus("success");
      } else {
        setStatus("error");
      }
    }
  }, [params.category, params.name]);
  async function handleLoadTemplate() {
    setLoadingTemplate(true);
    const newCharacter = await charactersManager.actions.add(
      template as ICharacterTemplate,
    );
    navigate(`/characters/${newCharacter.id}`);
  }
  const [fakeCharacter, setFakeCharacter] = useState<ICharacter>();

  function handleCancel() {
    navigate(`/`);
  }

  return (
    <Page sx={{ paddingTop: "2rem" }}>
      {template && (
        <PageMeta
          title={`Use the ${template?.fileName} character sheet template on Fari App`}
          description={`Get started playing TTRPGs online with Fari App using this ${template?.fileName} template!`}
        />
      )}
      {isLoading && (
        <Fade in>
          <Container maxWidth="md">
            <Box display="flex" justifyContent="center">
              <CircularProgress color="secondary" />
            </Box>
          </Container>
        </Fade>
      )}
      <Fade in={status === "success"}>
        <Box>
          <CharacterV3Dialog
            open={true}
            character={fakeCharacter}
            dialog={false}
            readonly={true}
          />
        </Box>
      </Fade>
      <Dialog open={status === "success"} onClose={handleCancel}>
        <DialogTitle
          sx={{
            textAlign: "center",
          }}
        >
          {`Create New Sheet`}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            component="div"
            sx={{
              textAlign: "center",
            }}
          >
            {`You're about to create a new character sheet using the "${template?.fileName}" template.`}
            <br />
            <br />
            {`Click "Use Template" to continue.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCancel}>{`Cancel`}</Button>
          <LoadingButton
            color="secondary"
            onClick={handleLoadTemplate}
            autoFocus
            loading={loadingTemplate}
          >
            {`Use Template`}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={status === "error"} onClose={handleCancel}>
        <DialogTitle
          sx={{
            textAlign: "center",
          }}
        >
          {`Template not found`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            {`The template you are trying to load does not exist.`}
            <br />
            <FormHelperText
              sx={{
                textAlign: "center",
              }}
            >
              {`Template: ${templateCategoryLabel}/${templateNameLabel}`}
            </FormHelperText>
            <FormHelperText
              sx={{
                textAlign: "center",
              }}
            >
              <Link
                color="secondary"
                href="https://farirpgs.com/discord"
                target="_blank"
                rel="no"
              >
                {`Get help`}
              </Link>
            </FormHelperText>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCancel} autoFocus>
            {`Back To Home Page`}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default NewCharacterRoute;
