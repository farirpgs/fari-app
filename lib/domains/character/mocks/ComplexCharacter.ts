import { IV2Character } from "../types";

export const ComplexCharacter: IV2Character = {
  id: "03dd15c8-5bed-40a5-b1e3-b0aa5e59e2e7",
  name: "Compliqué",
  aspectsLabel: "Aspects",
  group: "Le groupe des compliqués",
  aspects: [
    {
      name: "Grand Concept",
      value: "Mon grand concepte",
    },
  ],
  stuntsLabel: "Pouvoirs",
  stunts: [
    {
      name: "Mon super pouvoir",
      value: "Me permet de faire...",
    },
  ],
  skillsLabel: "Attributs",
  skills: [{ name: "Tout", value: "8" }],
  stressTracksLabel: "Stresse",
  stressTracks: [
    {
      name: "Physique",
      value: [
        { checked: false, label: "11" },
        { checked: true, label: "22" },
        { checked: false, label: "33" },
        { checked: true, label: "44" },
      ],
    },
  ],
  consequencesLabel: "Conséquences",
  consequences: [{ name: "Mild", value: "" }],
  refresh: 3,
  version: 2,
  notes: "Some notes...",
  notesLabel: "Les Notes",
  playedDuringTurn: false,
  refreshLabel: "Rafraichissement",
  fatePoints: 3,
  lastUpdated: 1606783644,
};
