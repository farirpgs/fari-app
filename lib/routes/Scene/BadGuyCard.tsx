import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  TextField
} from "@material-ui/core";
import React from "react";
import { IBadGuy } from "../../types/IBadGuy";
import { red } from "@material-ui/core/colors";

export const BadGuyCard: React.FC<{
  badGuy: IBadGuy;
  readOnly?: boolean;
  onUpdate: (badGuy: IBadGuy) => void;
  onModify: (badGuy: IBadGuy) => void;
  onRemove: (badGuy: IBadGuy) => void;
}> = props => {
  const { badGuy } = props;
  const stressCount = parseInt(badGuy.stress);
  const consequenceCount = parseInt(badGuy.consequences);

  return (
    <Paper
      style={{
        minHeight: "4rem",
        padding: "1rem 1.5rem 1rem 1.5rem",
        background: red[50],
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
            {badGuy.name}
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
            {badGuy.aspects}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "1rem 0" }}></Divider>
      <div>
        <b>Skilled (+2) at:</b> {badGuy.skilledAt}
      </div>
      <div>
        <b>Bad (-2) at:</b> {badGuy.badAt}
      </div>
      {!!stressCount && <Divider style={{ margin: "1rem 0" }}></Divider>}
      <div>
        <div className="row">
          <div className="col-xs">
            <div className="h2 margin-1">Stress</div>
          </div>
        </div>
        <div className="row">
          {[...new Array(stressCount)].map((u, stressIndex) => {
            return (
              <div className="col-xs-4" key={stressIndex}>
                <FormControlLabel
                  label={`#${stressIndex + 1}`}
                  control={
                    <Checkbox
                      checked={badGuy.stressValues[stressIndex] || false}
                      disabled={props.readOnly}
                      onChange={e => {
                        props.onUpdate({
                          ...badGuy,
                          stressValues: {
                            ...badGuy.stressValues,
                            [stressIndex]: e.target.checked
                          }
                        });
                      }}
                    />
                  }
                />
              </div>
            );
          })}
        </div>

        {!!consequenceCount && <Divider style={{ margin: "1rem 0" }}></Divider>}
        <div>
          <div className="row">
            {[...new Array(consequenceCount)].map((u, consequenceIndex) => {
              const consequenceShift = (consequenceIndex + 1) * 2;
              return (
                <div className="col-xs-12" key={consequenceIndex}>
                  <TextField
                    value={badGuy.consequencesValues[consequenceIndex] || ""}
                    label={`Consequence (${consequenceShift})`}
                    variant="filled"
                    margin="normal"
                    style={{
                      width: "100%"
                    }}
                    disabled={props.readOnly}
                    onChange={e => {
                      props.onUpdate({
                        ...badGuy,
                        consequencesValues: {
                          ...badGuy.consequencesValues,
                          [consequenceIndex]: e.target.value
                        }
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {!props.readOnly && (
        <>
          <Divider style={{ margin: "1rem 0" }}></Divider>
          <div className="row end-xs">
            <Button
              onClick={() => {
                props.onRemove(badGuy);
              }}
              color="secondary"
            >
              Remove
            </Button>
            <Button
              onClick={() => {
                props.onModify(badGuy);
              }}
              color="secondary"
            >
              Modify
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};
