import { Box, Grid, TextField } from "@material-ui/core";
import { css } from "emotion";
import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { Page } from "../../components/Page/Page";
import { usePeerConnections } from "./usePeerConnections";
import { usePeerHost } from "./usePeerHost";
import { usePeerJS } from "./usePeerJS";
const debug = false;
interface IScene {
  name: string;
}

export const ContentEditable: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  const [html, setHtml] = useState(props.value);

  useEffect(() => {
    setHtml(html);
  }, [props.value]);

  const $ref = useRef<HTMLDivElement>();

  function onChange() {
    if ($ref.current) {
      props.onChange($ref.current.innerHTML);
    }
  }

  return (
    <div
      ref={$ref}
      onInput={() => {
        onChange();
      }}
      onBlur={() => {
        onChange();
      }}
      contentEditable
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

ContentEditable.displayName = "ContentEditable";

export const IndexCard: React.FC<{
  title: string;
  content: string;
  onTitleChange(value: string): void;
}> = (props) => {
  return (
    <Box p=".5rem" bgcolor="#fff">
      <Box
        className={css({
          fontSize: "1.5rem",
          width: "100%",
          padding: "0.5rem 0",
          borderBottom: "1px solid #f0a4a4",
        })}
      >
        <ContentEditable
          value={props.title}
          onChange={props.onTitleChange}
        ></ContentEditable>
      </Box>
      <Box
        className={css({
          fontSize: "1.1rem",
          lineHeight: "1.7rem",
          padding: "0.5rem 0",
          width: "100%",
          borderBottom: "1px solid #ddd",
        })}
      >
        {props.content}
      </Box>
    </Box>
  );
};

IndexCard.displayName = "IndexCard";

export const Play: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const id = props.match.params.id;
  const [scene, setScene] = useState<IScene>({
    name: "",
  });
  const [title, setTitle] = useState("");
  const peerManager = usePeerJS({
    debug: debug,
  });
  const hostManager = usePeerHost({
    peer: peerManager.state.peer,
    onConnectionDataReceive() {},
    debug: debug,
  });
  const connectionsManager = usePeerConnections({
    id: id,
    hostId: peerManager.state.hostId,
    peer: peerManager.state.peer,
    onHostDataReceive(newScene) {
      setScene(newScene);
    },
    debug: debug,
  });

  const isGM = !id;

  const href = `/play/${peerManager.state.hostId}`;

  useEffect(() => {
    hostManager.actions.sendToConnections(scene);
  }, [scene]);

  return (
    <Page h1="Create Your Character" appBarActions={<Box></Box>}>
      {isGM ? renderForGM() : renderForPlayer()}
      {renderPre()}
    </Page>
  );

  function renderForGM() {
    return (
      <Box>
        <TextField
          label="Scene Name"
          value={scene.name}
          onChange={(event) => {
            const value = event.target.value;
            setScene(
              produce((draft) => {
                draft.name = value;
              })
            );
          }}
        />
        <Box p="2rem">
          <Grid container>
            <Grid item xs={4}>
              <IndexCard
                title={title}
                onTitleChange={(value) => {
                  setTitle(value);
                }}
                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. tora torquent per conubia nostra"
              ></IndexCard>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderForPlayer() {
    return <Box>{scene.name}</Box>;
  }

  function renderPre() {
    return (
      <pre>
        {JSON.stringify(
          {
            hostId: peerManager.state.hostId,
            href,
            numberOfConnections: hostManager.state.numberOfConnections,
            isConnectedToHost: connectionsManager.state.isConnectedToHost,
          },
          null,
          2
        )}
      </pre>
    );
  }
};

Play.displayName = "Play";
