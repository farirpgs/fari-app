import { readFileSync } from "fs";
import { FieldType, IField } from "../types/IField";
import { IGame } from "../types/IGame";

const name: IField = {
  label: "Character Name",
  slug: "name",
  type: FieldType.TextField,
};

const description: IField = {
  label: "Description",
  slug: "description",
  type: FieldType.BigTextField,
};

const refresh: IField = {
  label: "Refresh",
  slug: "refresh",
  type: FieldType.Number,
  default: "3",
  min: 0,
};

const fatePoints: IField = {
  label: "Current Fate Points",
  slug: "fatePoints",
  type: FieldType.Number,
  default: "3",
  min: 0,
};

const aspectCategory: IField = {
  label: "Aspects",
  slug: "aspectsCategory",
  type: FieldType.Category,
};

const approachCategory: IField = {
  label: "Approaches",
  slug: "approachesCategory",
  type: FieldType.Category,
};

const skillsCategory: IField = {
  label: "Skills",
  slug: "skillsCategory",
  type: FieldType.Category,
};

function makeAspect(label: string, slug: string): IField {
  return {
    label,
    slug,
    type: FieldType.TextField,
  };
}

function makeApproach(label: string, slug: string): IField {
  return {
    label,
    slug,
    type: FieldType.Number,
    min: 0,
    max: 3,
    default: "0",
  };
}

function makeSkill(label: string, slug: string, helper: string): IField {
  return {
    label,
    slug,
    type: FieldType.AutoComplete,
    possibleValues: [
      "Athletics",
      "Burglary",
      "Contacts",
      "Crafts",
      "Deceive",
      "Drive",
      "Empathy",
      "Fight",
      "Investigate",
      "Lore",
      "Notice",
      "Physique",
      "Provoke",
      "Rapport",
      "Resources",
      "Shoot",
      "Stealth",
      "Will",
    ],
    helper,
  };
}

const stunts: IField = {
  label: "Stunts",
  slug: "stunts",
  type: FieldType.BigTextField,
};

const extras: IField = {
  label: "Extras",
  slug: "extra",
  type: FieldType.BigTextField,
};

const stressCategory: IField = {
  label: "Stress",
  slug: "stressCategory",
  type: FieldType.Category,
};

const physicalStressCategory: IField = {
  label: "Physical Stress",
  slug: "physicalStressCategory",
  type: FieldType.Category,
};

const mentalStressCategory: IField = {
  label: "Mental Stress",
  slug: "mentalStressCategory",
  type: FieldType.Category,
};

const consequenceCategory: IField = {
  label: "Consequences",
  slug: "consequences",
  type: FieldType.Category,
};

const stress1: IField = {
  label: "1",
  slug: "stress1",
  type: FieldType.Boolean,
};

const stress2: IField = {
  label: "2",
  slug: "stress2",
  type: FieldType.Boolean,
};

const stress3: IField = {
  label: "3",
  slug: "stress3",
  type: FieldType.Boolean,
};

const physicalStress1: IField = {
  label: "1",
  slug: "physicalStress1",
  type: FieldType.Boolean,
};

const physicalStress2: IField = {
  label: "2",
  slug: "physicalStress2",
  type: FieldType.Boolean,
};

const physicalStress3: IField = {
  label: "3",
  slug: "physicalStress3",
  type: FieldType.Boolean,
};

const physicalStress4: IField = {
  label: "4",
  slug: "physicalStress4",
  type: FieldType.Boolean,
};

const mentalStress1: IField = {
  label: "1",
  slug: "mentalStress1",
  type: FieldType.Boolean,
};

const mentalStress2: IField = {
  label: "2",
  slug: "mentalStress2",
  type: FieldType.Boolean,
};

const mentalStress3: IField = {
  label: "3",
  slug: "mentalStress3",
  type: FieldType.Boolean,
};

const mentalStress4: IField = {
  label: "4",
  slug: "mentalStress4",
  type: FieldType.Boolean,
};

const mildConsequence: IField = {
  label: "Mild Consequence (2)",
  slug: "mildConsequence",
  type: FieldType.TextField,
};

const mildConsequence2: IField = {
  label: "Second Mild Consequence (2)",
  slug: "mildConsequence2",
  type: FieldType.TextField,
};

const moderateConsequence: IField = {
  label: "Moderate Consequence (4)",
  slug: "moderateConsequence",
  type: FieldType.TextField,
};

const severeConsequence: IField = {
  label: "Severe Consequence (6)",
  slug: "severeConsequence",
  type: FieldType.TextField,
};

export const FateAcceleratedStress = [stress1, stress2, stress3];

export const FateCorePhysicalStress = [
  physicalStress1,
  physicalStress2,
  physicalStress3,
  physicalStress4,
];

export const FateCoreMentalStress = [
  mentalStress1,
  mentalStress2,
  mentalStress3,
  mentalStress4,
];

export const FateAcceleratedConsequences = [
  mildConsequence,
  moderateConsequence,
  severeConsequence,
];

export const FateCoreConsequences = [
  mildConsequence,
  mildConsequence2,
  moderateConsequence,
  severeConsequence,
];

export const Aspects = [
  makeAspect("High Concept", "aspect1"),
  makeAspect("Trouble", "aspect2"),
  makeAspect("Aspect #3", "aspect3"),
  makeAspect("Aspect #4", "aspect4"),
  makeAspect("Aspect #5", "aspect5"),
];

export const FateAcceleratedApproaches = [
  makeApproach("Careful", "approachCareful"),
  makeApproach("Clever", "approachClever"),
  makeApproach("Forceful", "approachForceful"),
  makeApproach("Flashy", "approachFlashy"),
  makeApproach("Quick", "approachQuick"),
  makeApproach("Sneaky", "approachSneaky"),
];

export const FateCoreSkills = [
  makeSkill("Superb (+5)", "skillSuperb", ""),
  makeSkill("Great (+4)", "skillGreat", "You should have 1 of those"),
  makeSkill("Good (+3)", "skillGood", "You should have 2 of those"),
  makeSkill("Fair (+2)", "skillFair", "You should have 3 of those"),
  makeSkill("Average (+1)", "skillAverage", "You should have 4 of those"),
];

export const FateAccelerated: IGame = {
  name: "Fate Accelerated",
  slug: "fae",
  rows: [
    { columns: [{ col: 12, field: name }] },
    {
      columns: [
        { col: 6, field: description },
        { col: 3, field: refresh },
        { col: 3, field: fatePoints },
      ],
    },
    {
      columns: [
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: aspectCategory }] },
            { columns: [{ col: 12, field: Aspects[0] }] },
            { columns: [{ col: 12, field: Aspects[1] }] },
            { columns: [{ col: 12, field: Aspects[2] }] },
            { columns: [{ col: 12, field: Aspects[3] }] },
            { columns: [{ col: 12, field: Aspects[4] }] },
          ],
        },
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: approachCategory }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[0] }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[1] }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[2] }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[3] }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[4] }] },
            { columns: [{ col: 12, field: FateAcceleratedApproaches[5] }] },
          ],
        },
      ],
    },
    {
      columns: [
        { col: 6, field: extras },
        { col: 6, field: stunts },
      ],
    },
    {
      columns: [
        {
          col: 6,
          field: stressCategory,
          rows: [
            {
              columns: [
                { col: "initial", field: stress1 },
                { col: "initial", field: stress2 },
                { col: "initial", field: stress3 },
              ],
            },
          ],
        },
        {
          col: 6,
          field: consequenceCategory,
          rows: [
            {
              columns: [
                { col: 12, field: mildConsequence },
                { col: 12, field: moderateConsequence },
                { col: 12, field: severeConsequence },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const FateCore: IGame = {
  name: "Fate Core",
  slug: "fate",
  rows: [
    { columns: [{ col: 12, field: name }] },
    {
      columns: [
        { col: 6, field: description },
        { col: 3, field: refresh },
        { col: 3, field: fatePoints },
      ],
    },
    {
      columns: [
        {
          col: 6,
          rows: [
            { columns: [{ col: 12, field: aspectCategory }] },
            { columns: [{ col: 12, field: Aspects[0] }] },
            { columns: [{ col: 12, field: Aspects[1] }] },
            { columns: [{ col: 12, field: Aspects[2] }] },
            { columns: [{ col: 12, field: Aspects[3] }] },
            { columns: [{ col: 12, field: Aspects[4] }] },
          ],
        },
        {
          col: 6,
          rows: [
            {
              columns: [
                { col: 12, field: skillsCategory },
                { col: 12, field: FateCoreSkills[0] },
                { col: 12, field: FateCoreSkills[1] },
                { col: 12, field: FateCoreSkills[2] },
                { col: 12, field: FateCoreSkills[3] },
                { col: 12, field: FateCoreSkills[4] },
              ],
            },
          ],
        },
      ],
    },
    {
      columns: [
        { col: 6, field: extras },
        { col: 6, field: stunts },
      ],
    },
    {
      columns: [
        {
          col: 6,
          field: physicalStressCategory,
          rows: [
            {
              columns: [
                { col: "initial", field: physicalStress1 },
                { col: "initial", field: physicalStress2 },
                { col: "initial", field: physicalStress3 },
                { col: "initial", field: physicalStress4 },
              ],
            },
          ],
        },
        {
          col: 6,
          field: mentalStressCategory,
          rows: [
            {
              columns: [
                { col: "initial", field: mentalStress1 },
                { col: "initial", field: mentalStress2 },
                { col: "initial", field: mentalStress3 },
                { col: "initial", field: mentalStress4 },
              ],
            },
          ],
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
                { col: 12, field: severeConsequence },
              ],
            },
          ],
        },
      ],
    },
    { tab: "Guide", columns: [{ col: 6, field: guide }] },
  ],
};
