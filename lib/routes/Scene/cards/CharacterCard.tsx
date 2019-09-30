import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  TextField
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { ICharacter } from "../../../types/ICharacter";
import {
  FateAccelerated,
  FateCoreConsequences,
  FateAcceleratedStress,
  FateCorePhysicalStress,
  FateCoreMentalStress,
  FateAcceleratedConsequences
} from "../../../games/Fate";
import { green } from "@material-ui/core/colors";
import _ from "lodash";

export const CharacterCard: React.FC<{
  character: ICharacter;
  readOnly: boolean;
  isGM: boolean;
  onSync: (character: ICharacter) => void;
  onRemove: (character: ICharacter) => void;
}> = props => {
  const { character: characterFromProps } = props;
  const [character, setCharacter] = useState(characterFromProps);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) {
      setCharacter(characterFromProps);
    }
  }, [characterFromProps]);

  const isAccelerated = character.game === FateAccelerated.slug;
  const stressList = isAccelerated
    ? FateAcceleratedStress
    : FateCorePhysicalStress;
  const mentalStress = isAccelerated ? [] : FateCoreMentalStress;
  const consequenceList = isAccelerated
    ? FateAcceleratedConsequences
    : FateCoreConsequences;

  return (
    <Paper
      style={{
        minHeight: "4rem",
        padding: "1rem 1.5rem 1rem 1.5rem",
        background: green[50],
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
              fontSize: "1.2rem"
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
              fontSize: "1rem"
            }}
          >
            {character["aspect2"]}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "1rem 0" }}></Divider>
      {character["aspect3"] && (
        <div>
          <b>Aspect #3:</b> {character["aspect3"]}
        </div>
      )}
      {character["aspect4"] && (
        <div>
          <b>Aspect #4:</b> {character["aspect4"]}
        </div>
      )}
      {character["aspect5"] && (
        <div>
          <b>Aspect #5:</b> {character["aspect5"]}
        </div>
      )}
      <div>
        <div className="row">
          <div className="col-xs">
            <div className="h3">
              {isAccelerated ? "Stress" : "Physical Stress"}
            </div>
          </div>
        </div>
        <div className="row">
          {stressList.map(field => {
            return (
              <div className="col-xs" key={field.slug} style={{ flex: 0 }}>
                <FormControlLabel
                  label={field.label}
                  control={
                    <Checkbox
                      checked={character[field.slug] || false}
                      disabled={props.readOnly}
                      onChange={e => {
                        setIsDirty(true);
                        setCharacter({
                          ...character,
                          [field.slug]: e.target.checked
                        });
                      }}
                    />
                  }
                />
              </div>
            );
          })}
        </div>
        {mentalStress.length !== 0 && (
          <>
            <div className="row">
              <div className="col-xs">
                <div className="h3">Mental Stress</div>
              </div>
            </div>
            <div className="row">
              {mentalStress.map(field => {
                return (
                  <div className="col-xs" key={field.slug} style={{ flex: 0 }}>
                    <FormControlLabel
                      label={field.label}
                      control={
                        <Checkbox
                          checked={character[field.slug] || false}
                          disabled={props.readOnly}
                          onChange={e => {
                            setIsDirty(true);
                            setCharacter({
                              ...character,
                              [field.slug]: e.target.checked
                            });
                          }}
                        />
                      }
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {<Divider style={{ margin: "1rem 0" }}></Divider>}
        <div>
          <div className="row">
            {consequenceList.map(field => {
              return (
                <div className="col-xs-12" key={field.slug}>
                  {
                    <TextField
                      value={character[field.slug] || ""}
                      label={field.label}
                      disabled={props.readOnly}
                      variant="filled"
                      margin="normal"
                      style={{
                        width: "100%"
                      }}
                      onChange={e => {
                        setIsDirty(true);
                        setCharacter({
                          ...character,
                          [field.slug]: e.target.value
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
      {props.isGM && (
        <>
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
        </>
      )}
      {!props.isGM && (
        <>
          <div className="row end-xs">
            <Button
              onClick={() => {
                props.onSync(character);
              }}
              color="secondary"
            >
              Sync
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};
