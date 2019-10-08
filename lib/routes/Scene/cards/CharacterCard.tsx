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
  FateAcceleratedConsequences,
  FateAcceleratedApproaches
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
        marginBottom: "1rem",
        background: !props.readOnly ? "hsla(231, 48%, 48%, 0.16)" : "#fff"
      }}
    >
      {renderHeader()}
      {renderSkillsAndApproaches()}
      {renderOtherAspects()}
      {renderStress()}
      {renderConsequences()}
      {renderActions()}
    </Paper>
  );

  function renderHeader() {
    return (
      <>
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
        <div className="row center-xs margin-1">
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
      </>
    );
  }

  function renderSkillsAndApproaches() {
    return (
      <div
        className="margin-1"
        style={{
          padding: ".5rem",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          background: "rgb(245, 245, 245)"
        }}
      >
        <div className="row center-xs middle-xs">
          {FateAcceleratedApproaches.map(approach => {
            return (
              <div
                className="col-xs-2"
                style={{
                  alignItems: "baseline"
                }}
              >
                <div style={{ fontSize: "2em" }}>
                  {character[approach.slug]}
                </div>
                <div>{approach.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderOtherAspects() {
    return (
      <>
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
      </>
    );
  }

  function renderStress() {
    return (
      <>
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
        <Divider style={{ margin: "1rem 0" }}></Divider>
      </>
    );
  }

  function renderConsequences() {
    return (
      <>
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
                      margin="normal"
                      variant="outlined"
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
        <Divider style={{ margin: "1rem 0" }}></Divider>
      </>
    );
  }

  function renderActions() {
    return (
      <>
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
        {!props.isGM && !props.readOnly && (
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
      </>
    );
  }
};
