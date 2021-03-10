import { IV2Character } from "../types";

export const Warden: IV2Character = {
  id: "03dd15c8-5bed-40a5-b1e3-b0aa5e59e2e7",
  name: "Warden Le Magané",
  aspects: [
    {
      name: "High Concept",
      value:
        "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
    },
    {
      name: "Trouble Aspect",
      value:
        "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
    },
    {
      name: "RELATIONSHIP",
      value: "J'ai survécu grâce à l'apocalypse Rodolf Salis",
    },
    { name: "Other Aspect", value: "Ancien chasseur de tête / Assassin" },
    { name: "OTHER ASPECT", value: "" },
  ],
  stunts: [
    {
      name: "The voices, they are telling me things...",
      value: "Use Will instead of Notice (And +2)",
    },
    {
      name: "Touched by the occult",
      value:
        "Use Lore instead of Academics about occult, weird or creepy subjects",
    },
    {
      name: "Armor of Fear",
      value:
        "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
    },
  ],
  skills: [
    { name: "Academics", value: "" },
    { name: "Athletics", value: "2" },
    { name: "Burglary", value: "" },
    { name: "Contacts", value: "" },
    { name: "Crafts", value: "" },
    { name: "Deceive", value: "1" },
    { name: "Drive", value: "" },
    { name: "Empathy", value: "1" },
    { name: "Fight", value: "" },
    { name: "Investigate", value: "2" },
    { name: "Lore", value: "3" },
    { name: "Notice", value: "" },
    { name: "Physique", value: "1" },
    { name: "Provoke", value: "4" },
    { name: "Rapport", value: "2" },
    { name: "Resources", value: "" },
    { name: "Shoot", value: "" },
    { name: "Stealth", value: "1" },
    { name: "Will", value: "3" },
  ],
  stressTracks: [
    {
      name: "Physical",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
        { checked: false, label: "4" },
      ],
    },
    {
      name: "Mental",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
        { checked: false, label: "4" },
        { checked: false, label: "5" },
        { checked: false, label: "6" },
      ],
    },
    {
      name: "Corruption",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
        { checked: false, label: "4" },
      ],
    },
  ],
  consequences: [
    { name: "Mild", value: "" },
    { name: "Moderate", value: "" },
    { name: "Severe", value: "" },
  ],
  refresh: 3,
  aspectsLabel: undefined,
  version: 2,
  consequencesLabel: undefined,
  notes: undefined,
  notesLabel: undefined,
  playedDuringTurn: false,
  group: undefined,
  refreshLabel: undefined,
  skillsLabel: undefined,
  stressTracksLabel: undefined,
  stuntsLabel: undefined,
  fatePoints: 1,
  lastUpdated: 1606783644,
};
