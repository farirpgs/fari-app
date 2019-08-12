import { FieldType } from "./IField";
import { IGame } from "./IGame";

export const FateAccelerated: IGame = {
  name: "Fate Accelerated (FAE)",
  slug: "fae",
  fields: [
    {
      label: "Character Name",
      slug: "name",
      type: FieldType.TextField,
      column: 12
    },
    {
      label: "Description",
      slug: "description",
      type: FieldType.BigTextField,
      column: 8
    },
    {
      label: "Refresh",
      slug: "refresh",
      type: FieldType.Number,
      column: 2,
      min: 0
    },
    {
      label: "Current Fate Points",
      slug: "fatePoints",
      type: FieldType.Number,
      column: 2,
      min: 0
    },
    {
      label: "Aspects",
      slug: "aspectsCategory",
      type: FieldType.Category,
      column: 8
    },
    {
      label: "Approaches",
      slug: "approaches",
      type: FieldType.Category,
      column: 4
    },
    {
      label: "High Concept",
      slug: "aspect1",
      type: FieldType.TextField,
      column: 8
    },
    {
      label: "Careful",
      slug: "careful",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      label: "Trouble",
      slug: "aspect2",
      type: FieldType.TextField,
      column: 8
    },
    {
      label: "Clever",
      slug: "clever",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      label: "...",
      slug: "aspect3",
      type: FieldType.TextField,
      column: 8
    },

    {
      label: "Forceful",
      slug: "forceful",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      label: "...",
      slug: "aspect4",
      type: FieldType.TextField,
      column: 8
    },
    {
      label: "Flashy",
      slug: "flashy",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      label: "...",
      slug: "aspect5",
      type: FieldType.TextField,
      column: 8
    },
    {
      label: "Quick",
      slug: "quick",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      type: FieldType.Spacer,
      column: 8
    },
    {
      label: "Sneaky",
      slug: "sneaky",
      type: FieldType.Number,
      min: 0,
      max: 3,
      default: "0",
      column: 4
    },
    {
      label: "Stunts",
      slug: "stunts",
      type: FieldType.BigTextField,
      column: 12
    },
    {
      label: "Stress",
      slug: "stress",
      type: FieldType.Category,
      column: 6
    },
    {
      label: "Consequences",
      slug: "consequences",
      type: FieldType.Category,
      column: 6
    },
    {
      label: "Stress #1",
      slug: "stress1",
      type: FieldType.Boolean,
      column: 2
    },
    {
      label: "Stress #2",
      slug: "stress2",
      type: FieldType.Boolean,
      column: 2
    },
    {
      label: "Stress #3",
      slug: "stress3",
      type: FieldType.Boolean,
      column: 2
    },
    {
      label: "Mild",
      slug: "mildConsequence",
      type: FieldType.TextField,
      column: 6
    },
    {
      type: FieldType.Spacer,
      column: 6
    },
    {
      label: "Moderate",
      slug: "moderateConsequence",
      type: FieldType.TextField,
      column: 6
    },
    {
      type: FieldType.Spacer,
      column: 6
    },
    {
      label: "Severe",
      slug: "severeConsequence",
      type: FieldType.TextField,
      column: 6
    }
  ]
};
