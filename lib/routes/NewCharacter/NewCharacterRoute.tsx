import LoadingButton from "@mui/lab/LoadingButton";
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
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import kebabCase from "lodash/kebabCase";
import startCase from "lodash/startCase";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import {
  CharacterTemplates,
  ICharacterTemplate,
} from "../../domains/character/CharacterType";

export function NewCharacterRoute() {
  const charactersManager = useContext(CharactersContext);
  const history = useHistory();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [template, setTemplate] = useState<ICharacterTemplate>();
  const params = useParams<{
    category: string;
    name: string;
  }>();
  const templateCategoryLabel = startCase(params.category);
  const templateNameLabel = startCase(params.name);

  const [loadingTemplate, setLoadingTemplate] = useState(false);

  async function handleLoadTemplate() {
    setLoadingTemplate(true);
    const newCharacter = await charactersManager.actions.add(
      template as ICharacterTemplate
    );
    history.push(`/characters/${newCharacter.id}`);
  }

  useEffect(() => {
    loadAndRedirect();
    async function loadAndRedirect() {
      const template = CharacterTemplates.find((t) => {
        const categoryMatch =
          kebabCase(t.category) === kebabCase(params.category);
        const nameMatch = kebabCase(t.fileName) === kebabCase(params.name);
        return categoryMatch && nameMatch;
      });
      if (template) {
        setTemplate(template);
        setStatus("success");
      } else {
        setStatus("error");
      }
    }
  }, [params.category, params.name]);

  function handleCancel() {
    history.push(`/`);
  }

  return (
    <Page>
      <PageMeta
        title={`"${templateNameLabel}" character sheet template, on Fari App`}
        description={`Use the amazing "${templateNameLabel}" template and get ready to play!`}
      />
      <Fade in={status === "loading"}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </Fade>
      <Dialog open={status === "success"} onClose={handleCancel}>
        <DialogTitle
          sx={{
            textAlign: "center",
          }}
        >
          {`Add New Sheet To My Binder`}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            component="div"
            sx={{
              textAlign: "center",
            }}
          >
            {`You're about to add a new character sheet to your Binder using the "${templateNameLabel}" template.`}
            <br />
            <br />
            {`Click "Add Template" to continue.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{`Cancel`}</Button>
          <LoadingButton
            onClick={handleLoadTemplate}
            autoFocus
            loading={loadingTemplate}
          >
            {`Add Template`}
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
          <Button onClick={handleCancel} autoFocus>
            {`Back To Home Page`}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default NewCharacterRoute;
