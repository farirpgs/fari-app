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
import React, { useRef, useState } from "react";
import showdown from "showdown";
import { ICharacter } from "../../types/ICharacter";
import { FieldType, IField } from "../../types/IField";
import { IRow } from "../../types/IGame";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Chip } from "@material-ui/core";
import { googleAnalyticsService } from "../../services/injections";

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
  },
};

export function CharacterFields(props: {
  rows: Array<IRow>;
  character: ICharacter;
  setCharacter: (state: ICharacter) => void;
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
          background: "#f5f5f5",
        }}
        onChange={(e, clickedTab) => {
          setCurrentTab(clickedTab);
        }}
      >
        {Object.keys(tabs).map((tabName) => (
          <Tab key={tabName} label={tabName} />
        ))}
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
          <div className="row" key={index}>
            {row.columns.map((column, index) => {
              const shouldRenderSubRows =
                !!column.rows && column.rows.length > 0;

              const shouldRenderField = !!column.field;
              let className = "margin-1 ";
              className +=
                column.offet !== undefined
                  ? `col-md-offset-${column.offet} `
                  : "";
              className +=
                column.col === "initial"
                  ? `col-xs col-initial `
                  : `col-xs-12 col-md-${column.col} `;

              return (
                <div key={index} className={className}>
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
        {renderAutoComplete(field)}
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
                __html: converter.makeHtml(field.content),
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
              return field.marks.findIndex((mark) => mark.value === value) + 1;
            }}
            step={null}
            valueLabelDisplay="auto"
            value={character[field.slug] || field.default}
            min={field.min}
            max={field.max}
            onChange={(e, value) => {
              setCharacter({
                ...character,
                [field.slug]: value,
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
              onChange={(e) => {
                setCharacter({
                  ...character,
                  [field.slug]: e.target.checked,
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
          variant="filled"
          inputProps={{ min: field.min, max: field.max }}
          style={{
            width: "100%",
          }}
          onChange={(e) => {
            setCharacter({
              ...character,
              [field.slug]: e.target.value,
            });
          }}
        />
      )
    );
  }

  function renderTextField(field: IField): React.ReactNode {
    const isMultiline = field.type === FieldType.BigTextField;
    return (
      (field.type === FieldType.TextField ||
        field.type === FieldType.BigTextField) && (
        <OptimizedTextField
          field={field}
          character={character}
          multiline={isMultiline}
          onReady={(value) => {
            setCharacter({
              ...character,
              [field.slug]: value,
            });
          }}
        />
      )
    );
  }

  function renderAutoComplete(field: IField): React.ReactNode {
    const isValueFromOldControl = typeof character[field.slug] === "string";
    const value = isValueFromOldControl
      ? [character[field.slug]]
      : character[field.slug];
    return (
      field.type === FieldType.AutoComplete && (
        <Autocomplete
          multiple
          options={field.possibleValues}
          freeSolo
          value={value}
          onChange={(event, value) => {
            setCharacter({
              ...character,
              [field.slug]: value,
            });
          }}
          renderTags={(values: Array<string>, getTagProps) =>
            values.map((option: string, index: number) => (
              <Chip
                key={index}
                variant="outlined"
                label={option}
                style={{ margin: ".5rem" }}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              style={{ width: "100%" }}
              label={field.label}
            />
          )}
        />
      )
    );
  }
}

const OptimizedTextField: React.FC<{
  character: Object;
  field: IField;
  multiline: boolean;
  onReady: (value: string) => void;
}> = ({ character, field, onReady: onReady, multiline }) => {
  const [value, setValue] = useState(character[field.slug]);
  const timeout = useRef(undefined);
  const shouldRenderDefaultValue =
    value === undefined && field.default !== undefined;

  const multilineProps = multiline ? { multiline: true, rows: "5" } : {};
  return (
    <>
      <TextField
        label={field.label}
        value={shouldRenderDefaultValue ? field.default : value || ""}
        variant="filled"
        style={{
          width: "100%",
        }}
        onChange={(e) => {
          const value = e.target.value;
          clearTimeout(timeout.current);
          setValue(value);

          timeout.current = setTimeout(() => {
            onReady(value);
          }, 200);
        }}
        onBlur={(e) => {
          onReady(e.target.value);
        }}
        {...multilineProps}
      />
    </>
  );
};
