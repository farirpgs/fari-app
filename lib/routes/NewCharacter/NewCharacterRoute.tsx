"use client";
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
import { useContext, useEffect, useState } from "react";
import { Page } from "../../components/Page/Page";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { CharacterFactory } from "../../domains/character/CharacterFactory";

import { useParams, useRouter } from "next/navigation";
import { CharacterTemplatesContext } from "../../contexts/CharacterTemplatesContext/CharacterTemplatesContext";
import { ICharacter } from "../../domains/character/types";
import { ICharacterTemplate } from "../../services/character-templates/CharacterTemplateService";
import { CharacterV3Dialog } from "../Character/components/CharacterDialog/CharacterV3Dialog";

export function NewCharacterRoute() {
  const charactersManager = useContext(CharactersContext);
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [template, setTemplate] = useState<ICharacterTemplate>();
  const params = useParams();
  const categoryParam = params.category as string;
  const nameParam = params.name as string;
  const templateCategoryLabel = startCase(categoryParam);
  const templateNameLabel = startCase(nameParam);
  const characterTemplatesManager = useContext(CharacterTemplatesContext);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const isLoading = status === "loading";

  useEffect(() => {
    load();
    async function load() {
      const template = characterTemplatesManager.templates.find((t) => {
        const categoryMatch =
          kebabCase(t.publisher.toLowerCase()) ===
          kebabCase(categoryParam?.toLowerCase());
        const nameMatch =
          kebabCase(t.name.toLowerCase()) ===
          kebabCase(nameParam?.toLowerCase());
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
    router.push(`/characters/${newCharacter.id}`);
  }
  const [fakeCharacter, setFakeCharacter] = useState<ICharacter>();

  function handleCancel() {
    router.push(`/`);
  }

  return (
    <Page sx={{ paddingTop: "2rem" }}>
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
            {`You're about to create a new character sheet using the "${template?.name}" template.`}
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
