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
  label: "Aspect #3",
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
  label: "Aspect #4",
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
  label: "Aspect #5",
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

const stress1: IField = {
  label: "Stress #1",
  slug: "stress1",
  type: FieldType.Boolean
};
const stress2: IField = {
  label: "Stress #2",
  slug: "stress2",
  type: FieldType.Boolean
};
const stress3: IField = {
  label: "Stress #3",
  slug: "stress3",
  type: FieldType.Boolean
};

const physicalStress1: IField = {
  label: "Physical Stress #1",
  slug: "physicalStress1",
  type: FieldType.Boolean
};
const physicalStress2: IField = {
  label: "Physical Stress #2",
  slug: "physicalStress2",
  type: FieldType.Boolean
};
const physicalStress3: IField = {
  label: "Physical Stress #3",
  slug: "physicalStress3",
  type: FieldType.Boolean
};
const physicalStress4: IField = {
  label: "Physical Stress #4",
  slug: "physicalStress4",
  type: FieldType.Boolean
};

const mentalStress1: IField = {
  label: "Mental Stress #1",
  slug: "mentalStress1",
  type: FieldType.Boolean
};
const mentalStress2: IField = {
  label: "Mental Stress #2",
  slug: "mentalStress2",
  type: FieldType.Boolean
};
const mentalStress3: IField = {
  label: "Mental Stress #3",
  slug: "mentalStress3",
  type: FieldType.Boolean
};
const mentalStress4: IField = {
  label: "Mental Stress #4",
  slug: "mentalStress4",
  type: FieldType.Boolean
};

const mildConsequence: IField = {
  label: "Mild Consequence",
  slug: "mildConsequence",
  type: FieldType.TextField
};

const mildConsequence2: IField = {
  label: "Second Mild Consequence",
  slug: "mildConsequence2",
  type: FieldType.TextField
};

const moderateConsequence: IField = {
  label: "Moderate Consequence",
  slug: "moderateConsequence",
  type: FieldType.TextField
};

const severeConsequence: IField = {
  label: "Severe Consequence",
  slug: "severeConsequence",
  type: FieldType.TextField
};

const guide: IField = {
  type: FieldType.Paper,
  content: readFileSync(__dirname + "/Fate.md", "utf-8")
};

export const FateAccelerated: IGame = {
  name: "Fate Accelerated",
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
              columns: [
                { col: 4, field: stress1 },
                { col: 4, field: stress2 },
                { col: 4, field: stress3 }
              ]
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
  name: "Fate Core (Work in Progress)",
  slug: "fate",
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
            {
              columns: [
                // Super +5 - 0
                // Great +4 - 1
                // Good +3 - 2
                // Fair +2 - 3
                // Average +1 - 4
                { col: 12, field: skillsCategory }
              ]
            }
          ]
        }
      ]
    },
    { columns: [{ col: 6, field: extras }, { col: 6, field: stunts }] },
    {
      columns: [
        {
          col: 12,
          field: stressCategory,
          rows: [
            {
              columns: [
                { col: 3, field: physicalStress1 },
                { col: 3, field: physicalStress2 },
                { col: 3, field: physicalStress3 },
                { col: 3, field: physicalStress4 }
              ]
            },
            {
              columns: [
                { col: 3, field: mentalStress1 },
                { col: 3, field: mentalStress2 },
                { col: 3, field: mentalStress3 },
                { col: 3, field: mentalStress4 }
              ]
            }
          ]
        },
        {
          col: 12,
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
