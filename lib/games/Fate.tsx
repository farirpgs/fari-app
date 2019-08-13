import { readFileSync } from "fs";
import { FieldType, IField } from "./IField";
import { IGame } from "./IGame";

const name: IField = {
  label: "Character Name",
  slug: "name",
  type: FieldType.TextField
};

const description: IField = {
  label: "Description",
  slug: "description",
  type: FieldType.BigTextField
};

const refresh: IField = {
  label: "Refresh",
  slug: "refresh",
  type: FieldType.Number,
  default: "3",
  min: 0
};

const fatePoints: IField = {
  label: "Current Fate Points",
  slug: "fatePoints",
  type: FieldType.Number,
  min: 0
};

const aspectCategory: IField = {
  label: "Aspects",
  slug: "aspectsCategory",
  type: FieldType.Category
};

const approachCategory: IField = {
  label: "Approaches",
  slug: "approaches",
  type: FieldType.Category
};
const skillsCategory: IField = {
  label: "Skills",
  slug: "skills",
  type: FieldType.Category
};

const highConcept: IField = {
  label: "High Concept",
  slug: "aspect1",
  type: FieldType.TextField
};

const careful: IField = {
  label: "Careful",
  slug: "careful",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const trouble: IField = {
  label: "Trouble",
  slug: "aspect2",
  type: FieldType.TextField
};

const clever: IField = {
  label: "Clever",
  slug: "clever",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const aspect3: IField = {
  label: "...",
  slug: "aspect3",
  type: FieldType.TextField
};

const forceful: IField = {
  label: "Forceful",
  slug: "forceful",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const aspect4: IField = {
  label: "...",
  slug: "aspect4",
  type: FieldType.TextField
};
const flashy: IField = {
  label: "Flashy",
  slug: "flashy",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const aspect5: IField = {
  label: "...",
  slug: "aspect5",
  type: FieldType.TextField
};
const quick: IField = {
  label: "Quick",
  slug: "quick",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const sneaky: IField = {
  label: "Sneaky",
  slug: "sneaky",

  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0"
};

const stunts: IField = {
  label: "Stunts",
  slug: "stunts",
  type: FieldType.BigTextField
};
const extras: IField = {
  label: "Extras",
  slug: "extra",
  type: FieldType.BigTextField
};

const stressCategory: IField = {
  label: "Stress",
  slug: "stress",
  type: FieldType.Category
};
const consequenceCategory: IField = {
  label: "Consequences",
  slug: "consequences",
  type: FieldType.Category
};

const stress: IField = {
  label: "Stress",
  slug: "stress",
  default: 0,
  min: 0,
  max: 3,
  marks: [
    { label: "None", value: 0 },
    { label: "#1", value: 1 },
    { label: "#2", value: 2 },
    { label: "#3", value: 3 }
  ],
  type: FieldType.Slider
};

const physicalStress: IField = {
  label: "Physical Stress",
  slug: "physicalStress",
  default: 0,
  min: 0,
  max: 4,
  marks: [
    { label: "None", value: 0 },
    { label: "#1", value: 1 },
    { label: "#2", value: 2 },
    { label: "#3", value: 3 },
    { label: "#4", value: 4 }
  ],
  type: FieldType.Slider
};
const mentalStress: IField = {
  label: "Mental Stress",
  slug: "mentalStress",
  default: 0,
  min: 0,
  max: 4,
  marks: [
    { label: "None", value: 0 },
    { label: "#1", value: 1 },
    { label: "#2", value: 2 },
    { label: "#3", value: 3 },
    { label: "#4", value: 4 }
  ],
  type: FieldType.Slider
};

const mildConsequence: IField = {
  label: "Mild",
  slug: "mildConsequence",
  type: FieldType.TextField
};

const mildConsequence2: IField = {
  label: "Mild",
  slug: "mildConsequence2",
  type: FieldType.TextField
};

const moderateConsequence: IField = {
  label: "Moderate",
  slug: "moderateConsequence",
  type: FieldType.TextField
};

const severeConsequence: IField = {
  label: "Severe",
  slug: "severeConsequence",
  type: FieldType.TextField
};

const guide: IField = {
  type: FieldType.Paper,
  content: readFileSync(__dirname + "/Fate.md", "utf-8")
};

export const FateAccelerated: IGame = {
  name: "Fate Accelerated (FAE)",
  slug: "fae",
  rows: [
    { columns: [{ col: 12, field: name }] },
    {
      columns: [
        { col: 6, field: description },
        { col: 3, field: refresh },
        { col: 3, field: fatePoints }
      ]
    },
    {
      columns: [
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: aspectCategory }] },
            { columns: [{ col: 12, field: highConcept }] },
            { columns: [{ col: 12, field: trouble }] },
            { columns: [{ col: 12, field: aspect3 }] },
            { columns: [{ col: 12, field: aspect4 }] },
            { columns: [{ col: 12, field: aspect5 }] }
          ]
        },
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: approachCategory }] },
            { columns: [{ col: 12, field: careful }] },
            { columns: [{ col: 12, field: clever }] },
            { columns: [{ col: 12, field: forceful }] },
            { columns: [{ col: 12, field: flashy }] },
            { columns: [{ col: 12, field: quick }] },
            { columns: [{ col: 12, field: sneaky }] }
          ]
        }
      ]
    },
    { columns: [{ col: 12, field: stunts }] },
    {
      columns: [
        {
          col: 6,
          field: stressCategory,
          rows: [
            {
              columns: [{ col: 10, field: stress }]
            }
          ]
        },
        {
          col: 6,
          field: consequenceCategory,
          rows: [
            {
              columns: [
                { col: 12, field: mildConsequence },
                { col: 12, field: moderateConsequence },
                { col: 12, field: severeConsequence }
              ]
            }
          ]
        }
      ]
    },
    { tab: "Guide", columns: [{ col: 6, field: guide }] }
  ]
};

export const FateCore: IGame = {
  name: "Fate Core",
  slug: "fate",
  rows: [
    { columns: [{ col: 6, field: name }] },
    {
      columns: [
        { col: 6, field: description },
        { col: 3, field: refresh },
        { col: 3, field: fatePoints }
      ]
    },
    {
      columns: [
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: aspectCategory }] },
            { columns: [{ col: 12, field: highConcept }] },
            { columns: [{ col: 12, field: trouble }] },
            { columns: [{ col: 12, field: aspect3 }] },
            { columns: [{ col: 12, field: aspect4 }] },
            { columns: [{ col: 12, field: aspect5 }] }
          ]
        },
        {
          col: 6,
          rows: [{ columns: [{ col: 12, field: skillsCategory }] }]
        }
      ]
    },
    { columns: [{ col: 6, field: extras }, { col: 6, field: stunts }] },
    {
      columns: [
        {
          col: 6,
          field: stressCategory,
          rows: [
            {
              columns: [{ col: 10, field: physicalStress }]
            },
            {
              columns: [{ col: 10, field: mentalStress }]
            }
          ]
        },
        {
          col: 6,
          field: consequenceCategory,
          rows: [
            {
              columns: [
                { col: 6, field: mildConsequence },
                { col: 6, field: mildConsequence2 },
                { col: 12, field: moderateConsequence },
                { col: 12, field: severeConsequence }
              ]
            }
          ]
        }
      ]
    },
    { tab: "Guide", columns: [{ col: 6, field: guide }] }
  ]
};
