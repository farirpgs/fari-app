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
import { FateAccelerated } from "../../games/Fate";

export const CharacterCard: React.FC<{
  character: ICharacter;
  onUpdate: (character: ICharacter) => void;
  onRemove: (character: ICharacter) => void;
}> = props => {
  const { character } = props;
  const isAccelerated = character.game === FateAccelerated.slug;
  const stressList = isAccelerated
    ? ["stress1", "stress2", "stress3"]
    : ["stress1", "stress2", "stress3"];

  const consequenceList = isAccelerated
    ? [
        "mildConsequence",
        "mildConsequence2",
        "moderateConsequence",
        "severeConsequence"
      ]
    : ["mildConsequence", "moderateConsequence", "severeConsequence"];
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
            {character["aspect1"]}
          </div>
        </div>
      </div>
      <div className="row center-xs">
        <div className="col-xs-12">
          <div
            style={{
              fontStyle: "italic",
              fontSize: "1rem",
              marginBottom: "1rem"
            }}
          >
            {character["aspect2"]}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "1rem 0" }}></Divider>
      <div>
        <b>Aspect #3:</b> {character["aspect3"]}
      </div>
      <div>
        <b>Aspect #4:</b> {character["aspect4"]}
      </div>
      <div>
        <b>Aspect #5:</b> {character["aspect5"]}
      </div>
      {<Divider style={{ margin: "1rem 0" }}></Divider>}
      <div>
        <div className="row">
          <div className="col-xs">
            <div className="h2 margin-1">
              {isAccelerated ? "Stress" : "Physical Stress"}
            </div>
          </div>
        </div>
        <div className="row">
          {stressList.map((stressSlug, stressIndex) => {
            return (
              <div className="col-xs-4" key={stressSlug}>
                <FormControlLabel
                  label={`#${stressIndex + 1}`}
                  control={
                    <Checkbox
                      checked={character[stressSlug] || false}
                      onChange={e => {
                        props.onUpdate({
                          ...character,
                          [stressSlug]: e.target.checked
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
            {consequenceList.map((consequenceSlug, consequenceIndex) => {
              const consequenceShift = (consequenceIndex + 1) * 2;
              return (
                <div className="col-xs-12" key={consequenceIndex}>
                  {
                    <TextField
                      value={character[consequenceSlug] || ""}
                      label={`Consequence (${consequenceShift})`}
                      variant="filled"
                      margin="normal"
                      style={{
                        width: "100%"
                      }}
                      onChange={e => {
                        props.onUpdate({
                          ...character,
                          [consequenceSlug]: e.target.value
                        });
                      }}
                    />
                  }
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
