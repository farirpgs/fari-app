import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  TextField
} from "@material-ui/core";
import React from "react";
import { ICharacter } from "../../types/ICharacter";

export const CharacterCard: React.FC<{
  character: ICharacter;
  onUpdate: (character: ICharacter) => void;
  onRemove: (character: ICharacter) => void;
}> = props => {
  const { character } = props;

  return (
    <Paper
      style={{
        minHeight: "4rem",
        padding: "1rem 1.5rem 1rem 1.5rem",
        marginBottom: "1rem"
      }}
    >
      <div className="row center-xs">
        <div className="col-xs-12">
          <div
            style={{
              textTransform: "uppercase",
              fontSize: "1.5rem"
            }}
          >
            {character.name}
          </div>
        </div>
      </div>
      <div className="row center-xs">
        <div className="col-xs-12">
          <div
            style={{
              fontStyle: "italic",
              fontSize: "1.2rem",
              marginBottom: "1rem"
            }}
          >
            {character.aspects}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "1rem 0" }}></Divider>
      <div>
        <b>High Concept:</b> {character["aspect1"]}
      </div>
      <div>
        <b>Trouble:</b> {character["aspect2"]}
      </div>
      <div>
        <b>Aspect:</b> {character["aspect3"]}
      </div>
      <div>
        <b>Aspect:</b> {character["aspect4"]}
      </div>
      <div>
        <b>Aspect:</b> {character["aspect5"]}
      </div>
      {<Divider style={{ margin: "1rem 0" }}></Divider>}
      <div>
        <div className="row">
          <div className="col-xs">
            <div className="h2 margin-1">Stress</div>
          </div>
        </div>
        <div className="row">
          {[...new Array(3)].map((u, stressIndex) => {
            return (
              <div className="col-xs-4" key={stressIndex}>
                <FormControlLabel
                  label={`#${stressIndex + 1}`}
                  control={
                    <Checkbox
                      checked={character.stressValues[stressIndex] || false}
                      onChange={e => {
                        props.onUpdate({
                          ...character,
                          [`stress${stressIndex + 1}`]: e.target.checked
                        });
                      }}
                    />
                  }
                />
              </div>
            );
          })}
        </div>

        {<Divider style={{ margin: "1rem 0" }}></Divider>}
        <div>
          <div className="row">
            {[...new Array(3)].map((u, consequenceIndex) => {
              const consequenceShift = (consequenceIndex + 1) * 2;
              return (
                <div className="col-xs-12" key={consequenceIndex}>
                  <TextField
                    value={character.consequencesValues[consequenceIndex] || ""}
                    label={`Consequence (${consequenceShift})`}
                    variant="filled"
                    margin="normal"
                    style={{
                      width: "100%"
                    }}
                    onChange={e => {
                      props.onUpdate({
                        ...character
                        // consequencesValues: {
                        // ...character.consequencesValues,
                        // [`stress${stressIndex}`]: e.target.checked
                        // [consequenceIndex]: e.target.value
                        // }
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "1rem 0" }}></Divider>
      <div className="row end-xs">
        <Button
          onClick={() => {
            props.onRemove(character);
          }}
          color="secondary"
        >
          Remove
        </Button>
      </div>
    </Paper>
  );
};
