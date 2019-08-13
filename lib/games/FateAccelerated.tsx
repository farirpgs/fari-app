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

const highConcept: IField = {
  label: "High Concept",
  slug: "aspect1",
  type: FieldType.TextField,
  helper: `This is a single phrase or sentence that
           neatly sums up your character, saying who
           you are, what you do, what your “deal” is`
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
  type: FieldType.TextField,
  helper: `Decide on the thing that always gets you into trouble.
          It could be a personal weakness, or a recurring enemy,
          or an important obligation. Anything that makes your life
          complicated`
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
  type: FieldType.TextField,
  helper: `Think of something really important or
          interesting about your character. Are
          they the strongest person in their hometown?
          Do they carry a mighty sword known through history?
          Do they talk too much? Are they filthy rich?`
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
  type: FieldType.BigTextField,
  helper: ` Stunt is a special trait that changes the way
          an approach works for your character.
          Generally, stunts give you a bonus (almost always +2)
          to a certain approach when used with a particular
          action under specific circumstances.

          However, if this is your first time playing a Fate game,
          you might find it easier to pick your first stunt after
          you’ve had a chance to play a bit, to give you an idea
          of what a good stunt might be.
          Just add your stunt during or after your first game session.
          `
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
const mildConsequence: IField = {
  label: "Mild",
  slug: "mildConsequence",
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

const ladderGuide: IField = {
  type: FieldType.Paper,

  content: `
# The Ladder
- +8	Legendary
- +7	Epic
- +6	Fantastic
- +5	Superb
- +4	Great
- +3	Good
- +2	Fair
- +1	Average
- 0	Mediocre
- -1	Poor
- -2	Terrible
`
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
              columns: [
                { col: 3, field: stress1 },
                { col: 3, field: stress2 },
                { col: 3, field: stress3 }
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
    { tab: "Guide", columns: [{ col: 12, field: ladderGuide }] }
  ]
};
