import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import showdown from "showdown";
import { FieldType, IField } from "../games/IField";
import { IRow } from "../games/IGame";

const converter = new showdown.Converter();

export function CharacterFields<T>(props: {
  rows: Array<IRow>;
  character: T;
  setCharacter: (state: T) => void;
  onSubmit: () => void;
}) {
  const { rows, character, setCharacter } = props;
  const [currentTab, setCurrentTab] = useState(0);

  const tabs: { [tabName: string]: Array<IRow> } = rows.reduce(
    (tabs, row) => {
      if (!row.tab) {
        tabs["Default"].push(row);
        return tabs;
      }
      if (!tabs[row.tab]) {
        tabs[row.tab] = [];
      }
      tabs[row.tab].push(row);
      return tabs;
    },
    { Default: [] }
  );
  const currentTabName = Object.keys(tabs)[currentTab];
  const currentTagFieldsRows = tabs[currentTabName];

  return (
    <form onSubmit={props.onSubmit}>
      <Tabs
        value={currentTab}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        style={{
          background: "#f5f5f5"
        }}
        onChange={(e, clickedTab) => {
          setCurrentTab(clickedTab);
        }}
      >
        {Object.keys(tabs).map(tabName => (
          <Tab key={tabName} label={tabName} />
        ))}
      </Tabs>
      <br />
      <div className="row">
        <div className="col-xs-12">
          {currentTagFieldsRows.map((row, index) => {
            return (
              <div
                className="row"
                key={index}
                style={{
                  marginBottom: "1rem"
                }}
              >
                {row.fields.map(field => (
                  <div
                    key={`${field.slug}-${index}`}
                    className={`col-md-${field.column} col-md-offset-${
                      field.offet
                    } col-xs-12`}
                  >
                    <FormControl style={{ width: "100%" }}>
                      {renderTextField(field)}
                      {renderBigTextField(field)}
                      {renderNumber(field)}
                      {renderBoolean(field)}
                      {renderCategory(field)}
                      {renderPaper(field)}
                      <FormHelperText>{field.helper}</FormHelperText>
                    </FormControl>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );

  function renderPaper(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Paper && (
        <div>
          <h2>{field.label}</h2>
          <Paper style={{ padding: "1rem" }}>
            <div
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(field.content)
              }}
            />
          </Paper>
        </div>
      )
    );
  }

  function renderCategory(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Category && (
        <div>
          <h2>{field.label}</h2>
        </div>
      )
    );
  }

  function renderBoolean(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Boolean && (
        <FormControlLabel
          control={
            <Checkbox
              checked={character[field.slug] || false}
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
      )
    );
  }

  function renderNumber(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Number && (
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
      )
    );
  }

  function renderBigTextField(field: IField): React.ReactNode {
    return (
      field.type === FieldType.BigTextField && (
        <TextField
          label={field.label}
          value={character[field.slug] || ""}
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
      )
    );
  }

  function renderTextField(field: IField): React.ReactNode {
    return (
      field.type === FieldType.TextField && (
        <TextField
          label={field.label}
          value={character[field.slug] || ""}
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
      )
    );
  }
}
