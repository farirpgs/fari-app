import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import showdown from "showdown";
import { FieldType, IField } from "../games/IField";
import { IRow } from "../games/IGame";

const converter = new showdown.Converter();
export const selectors = {
  rowsToTabs(rows: Array<IRow>): { [tabName: string]: Array<IRow> } {
    return rows.reduce(
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
  }
};
export function CharacterFields<T>(props: {
  rows: Array<IRow>;
  character: T;
  setCharacter: (state: T) => void;
  onSubmit: () => void;
}) {
  const { rows, character, setCharacter } = props;
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = selectors.rowsToTabs(rows);
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
        {/* <Tab label={"Export"} /> */}
      </Tabs>
      <br />
      <div className="row">
        <div className="col-xs-12">{renderRows(currentTagFieldsRows)}</div>
      </div>
    </form>
  );

  function renderRows(rows: Array<IRow>) {
    {
      return rows.map((row, index) => {
        return (
          <div
            className="row"
            key={index}
            style={{
              marginBottom: "1rem"
            }}
          >
            {row.columns.map((column, index) => {
              const shouldRenderSubRows =
                !!column.rows && column.rows.length > 0;

              const shouldRenderField = !!column.field;
              return (
                <div
                  key={index}
                  className={`col-md-${column.col} col-md-offset-${
                    column.offet
                  } col-xs-12`}
                >
                  {shouldRenderField && renderField(column.field)}
                  {shouldRenderSubRows && renderRows(column.rows)}
                </div>
              );
            })}
          </div>
        );
      });
    }
  }

  function renderField(field: IField) {
    return (
      <FormControl key={field.slug} style={{ width: "100%" }}>
        {renderTextField(field)}
        {renderBigTextField(field)}
        {renderNumber(field)}
        {renderBoolean(field)}
        {renderCategory(field)}
        {renderSlider(field)}
        {renderPaper(field)}
        <FormHelperText>{field.helper}</FormHelperText>
      </FormControl>
    );
  }

  function renderPaper(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Paper && (
        <div>
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

  function renderSlider(field: IField): React.ReactNode {
    return (
      field.type === FieldType.Slider && (
        <>
          <Typography id="discrete-slider-restrict" gutterBottom>
            {field.label}
          </Typography>
          <Slider
            defaultValue={field.default as number}
            valueLabelFormat={(value: number) => {
              return field.marks.findIndex(mark => mark.value === value) + 1;
            }}
            step={null}
            valueLabelDisplay="auto"
            value={character[field.slug] || field.default}
            min={field.min}
            max={field.max}
            onChange={(e, value) => {
              setCharacter({
                ...character,
                [field.slug]: value
              });
            }}
            marks={field.marks}
          />
        </>
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
    const shouldRenderDefaultValue =
      character[field.slug] === undefined && field.default !== undefined;
    return (
      field.type === FieldType.Number && (
        <TextField
          label={field.label}
          value={
            shouldRenderDefaultValue
              ? field.default
              : character[field.slug] || ""
          }
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
    const shouldRenderDefaultValue =
      character[field.slug] === undefined && field.default !== undefined;
    return (
      field.type === FieldType.BigTextField && (
        <TextField
          label={field.label}
          value={
            shouldRenderDefaultValue
              ? field.default
              : character[field.slug] || ""
          }
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
    const shouldRenderDefaultValue =
      character[field.slug] === undefined && field.default !== undefined;

    return (
      field.type === FieldType.TextField && (
        <TextField
          label={field.label}
          value={
            shouldRenderDefaultValue
              ? field.default
              : character[field.slug] || ""
          }
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
