import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FieldType, IField } from "../games/IField";

export function CharacterFields<T>(props: {
  fields: Array<IField>;
  character: T;
  setCharacter: (state: T) => void;
}) {
  const { fields, character, setCharacter } = props;
  return (
    <div className="row">
      {fields.map((field, index) => {
        return (
          <div
            key={`${field.slug}-${index}`}
            className={`col-md-${field.column} col-xs-12`}
            style={{
              marginBottom: "1rem"
            }}
          >
            {field.type === FieldType.TextField && (
              <div>
                <TextField
                  label={field.label}
                  value={character[field.slug]}
                  variant="outlined"
                  style={{
                    width: "100%"
                  }}
                  onChange={e => {
                    setCharacter({
                      ...character,
                      [field.slug]: e.target.value
                    });
                  }}
                />
              </div>
            )}
            {field.type === FieldType.BigTextField && (
              <div>
                <TextField
                  label={field.label}
                  value={character[field.slug]}
                  multiline
                  rows="5"
                  style={{
                    width: "100%"
                  }}
                  variant="outlined"
                  onChange={e => {
                    setCharacter({
                      ...character,
                      [field.slug]: e.target.value
                    });
                  }}
                />
              </div>
            )}
            {field.type === FieldType.Number && (
              <div>
                <TextField
                  label={field.label}
                  value={character[field.slug] || field.default}
                  type="number"
                  variant="outlined"
                  inputProps={{ min: field.min, max: field.max }}
                  style={{
                    width: "100%"
                  }}
                  onChange={e => {
                    setCharacter({
                      ...character,
                      [field.slug]: e.target.value
                    });
                  }}
                />
              </div>
            )}
            {field.type === FieldType.Boolean && (
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={character[field.slug]}
                      onChange={e => {
                        setCharacter({
                          ...character,
                          [field.slug]: e.target.checked
                        });
                      }}
                    />
                  }
                  label={field.label}
                />
              </div>
            )}
            {field.type === FieldType.Category && (
              <div>
                <h2>{field.label}</h2>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
