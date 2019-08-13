import { FieldType, IField } from "./IField";
import { IGame } from "./IGame";

const name: IField = {
  label: "Character Name",
  slug: "name",
  type: FieldType.TextField,
  column: 12
};

const description: IField = {
  label: "Description",
  slug: "description",
  type: FieldType.BigTextField,
  column: 8
};

const refresh: IField = {
  label: "Refresh",
  slug: "refresh",
  type: FieldType.Number,
  default: "3",
  column: 2,
  min: 0
};

const fatePoints: IField = {
  label: "Current Fate Points",
  slug: "fatePoints",
  type: FieldType.Number,
  column: 2,
  min: 0
};

const aspectCategory: IField = {
  label: "Aspects",
  slug: "aspectsCategory",
  type: FieldType.Category,
  column: 8
};

const approachCategory: IField = {
  label: "Approaches",
  slug: "approaches",
  type: FieldType.Category,
  column: 4
};

const highConcept: IField = {
  label: "High Concept",
  slug: "aspect1",
  type: FieldType.TextField,
  helper: `This is a single phrase or sentence that
           neatly sums up your character, saying who
           you are, what you do, what your “deal” is`,
  column: 8
};

const careful: IField = {
  label: "Careful",
  slug: "careful",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
};

const trouble: IField = {
  label: "Trouble",
  slug: "aspect2",
  type: FieldType.TextField,
  helper: `Decide on the thing that always gets you into trouble.
          It could be a personal weakness, or a recurring enemy,
          or an important obligation. Anything that makes your life
          complicated`,
  column: 8
};

const clever: IField = {
  label: "Clever",
  slug: "clever",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
};

const aspect3: IField = {
  label: "...",
  slug: "aspect3",
  type: FieldType.TextField,
  helper: `Think of something really important or
          interesting about your character. Are
          they the strongest person in their hometown?
          Do they carry a mighty sword known through history?
          Do they talk too much? Are they filthy rich?`,
  column: 8
};

const forceful: IField = {
  label: "Forceful",
  slug: "forceful",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
};

const aspect4: IField = {
  label: "...",
  slug: "aspect4",
  type: FieldType.TextField,
  column: 8
};
const flashy: IField = {
  label: "Flashy",
  slug: "flashy",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
};

const aspect5: IField = {
  label: "...",
  slug: "aspect5",
  type: FieldType.TextField,
  column: 8
};
const quick: IField = {
  label: "Quick",
  slug: "quick",
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
};

const sneaky: IField = {
  label: "Sneaky",
  slug: "sneaky",
  offet: 8,
  type: FieldType.Number,
  min: 0,
  max: 3,
  default: "0",
  column: 4
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
          `,
  column: 12
};

const stressCategory: IField = {
  label: "Stress",
  slug: "stress",
  type: FieldType.Category,
  column: 6
};
const consequenceCategory: IField = {
  label: "Consequences",
  slug: "consequences",
  type: FieldType.Category,
  column: 6
};

const stress1: IField = {
  label: "Stress #1",
  slug: "stress1",
  type: FieldType.Boolean,
  column: 2
};
const stress2: IField = {
  label: "Stress #2",
  slug: "stress2",
  type: FieldType.Boolean,
  column: 2
};
const stress3: IField = {
  label: "Stress #3",
  slug: "stress3",
  type: FieldType.Boolean,
  column: 2
};
const mildConsequence: IField = {
  label: "Mild",
  slug: "mildConsequence",
  type: FieldType.TextField,
  column: 6
};

const moderateConsequence: IField = {
  label: "Moderate",
  slug: "moderateConsequence",
  type: FieldType.TextField,
  column: 6,
  offet: 6
};

const severeConsequence: IField = {
  label: "Severe",
  slug: "severeConsequence",
  type: FieldType.TextField,
  column: 6,
  offet: 6
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
`,
  column: 6
};

export const FateAccelerated: IGame = {
  name: "Fate Accelerated (FAE)",
  slug: "fae",
  rows: [
    { fields: [name] },
    { fields: [description, refresh, fatePoints] },
    { fields: [aspectCategory, approachCategory] },
    { fields: [highConcept, careful] },
    { fields: [trouble, clever] },
    { fields: [aspect3, forceful] },
    { fields: [aspect4, flashy] },
    { fields: [aspect5, quick] },
    { fields: [sneaky] },
    { fields: [stunts] },
    { fields: [stressCategory, consequenceCategory] },
    { fields: [stress1, stress2, stress3, mildConsequence] },
    { fields: [moderateConsequence] },
    { fields: [severeConsequence] },
    { fields: [ladderGuide], tab: "Guide" }
  ]
};
