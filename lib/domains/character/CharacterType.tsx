export enum CharacterTemplates {
  Blank = "Blank",
  ChargeRPG = "Charge RPG",
  Dnd5e = "Dnd 5e",
  DresdenFilesAccelerated = "Dresden Files Accelerated",
  DresdenFilesRPGCharacter = "Dresden Files RPG Character",
  DresdenFilesRPGSpellCaster = "Dresden Files RPG SpellCaster",
  DresdenFilesRPGVampire = "Dresden Files RPG Vampire",
  EdgeOfTheEmpire = "Edge Of The Empire",
  EdgeOfTheEmpireFrench = "Edge Of The Empire (FR)",
  EvolutionPulseHydrah = "Evolution Pulse: Hydrah",
  EvolutionPulseHyonos = "Evolution Pulse: Hyonos",
  EvolutionPulseLostH = "Evolution Pulse: LostH",
  EvolutionPulseObscura = "Evolution Pulse: Obscura",
  EvolutionPulseProxy = "Evolution Pulse: Proxy",
  FateAccelerated = "Fate Accelerated",
  FateAcceleratedBrazilianPortuguese = "Fate Accelerated (PT-BR)",
  FateAcceleratedFrench = "Fate Core (FR)",
  FateAcceleratedPolish = "Fate Accelerated (PL)",
  FateCondensed = "Fate Condensed",
  FateCondensedBrazilianPortuguese = "Fate Condensed (PT-BR)",
  FateCondensedGerman = "Fate Condensed (DE)",
  FateCondensedPolish = "Fate Condensed (PL)",
  FateCondensedSpanish = "Fate Condensed (ES)",
  FateCondensedTurkish = "Fate Condensed (TR)",
  FateCore = "Fate Core",
  FateCoreFrench = "Fate Core (FR)",
  FateCorePolish = "FateCore (PL)",
  FateCoreSpanish = "Fate Core (ES)",
  FateOfCthulhu = "Fate Of Cthulhu",
  Heartbreaker = "Heartbreaker",
  IronEddaAccelerated = "Iron Edda Accelerated",
  LifeBeyondExoStation = "Life Beyond Exo Station",
  MärchenkriegerLOS = "Märchenkrieger LOS",
  Maze = "Maze",
  StrandsOfFate = "Strands Of Fate",
  TachyonSquadronCharacter = "Tachyon Squadron Character",
  TachyonSquadronCharacterAndShip = "Tachyon Squadron Character And Ship",
  TachyonSquadronShip = "Tachyon Squadron Ship",
  ThePool = "The Pool",
  TheWitchIsDead = "The Witch Is Dead",
  TroikaNuminousEdition = "Troika Numinous Edition",
  TunnelsAndTrolls = "Tunnels And Trolls",
  VentureCity = "Venture City",
}

export type ICharacterTemplateWithGroup = {
  label: CharacterTemplates;
  group: string;
};

export const CharacterTemplatesWithGroups: Array<ICharacterTemplateWithGroup> =
  [
    { group: "Fari Games", label: CharacterTemplates.ChargeRPG },
    { group: "Fari Games", label: CharacterTemplates.LifeBeyondExoStation },
    { group: "Fate", label: CharacterTemplates.FateCondensed },
    { group: "Fate", label: CharacterTemplates.FateCore },
    { group: "Fate", label: CharacterTemplates.FateAccelerated },
    { group: "Fate", label: CharacterTemplates.FateOfCthulhu },
    { group: "Fate", label: CharacterTemplates.DresdenFilesAccelerated },
    { group: "Fate", label: CharacterTemplates.VentureCity },
    { group: "Fate", label: CharacterTemplates.Heartbreaker },
    { group: "Fate", label: CharacterTemplates.IronEddaAccelerated },
    { group: "Fate", label: CharacterTemplates.StrandsOfFate },
    { group: "Fate", label: CharacterTemplates.MärchenkriegerLOS },
    {
      group: "Fate (Spanish)",
      label: CharacterTemplates.FateCondensedSpanish,
    },
    { group: "Fate (Spanish)", label: CharacterTemplates.FateCoreSpanish },
    {
      group: "Fate (Turkish)",
      label: CharacterTemplates.FateCondensedTurkish,
    },
    {
      group: "Fate (Brazilian Portuguese)",
      label: CharacterTemplates.FateCondensedBrazilianPortuguese,
    },
    {
      group: "Fate (Brazilian Portuguese)",
      label: CharacterTemplates.FateAcceleratedBrazilianPortuguese,
    },
    {
      group: "Fate (German)",
      label: CharacterTemplates.FateCondensedGerman,
    },
    {
      group: "Fate (Polish)",
      label: CharacterTemplates.FateAcceleratedPolish,
    },
    {
      group: "Fate (Polish)",
      label: CharacterTemplates.FateCondensedPolish,
    },
    {
      group: "Fate (Polish)",
      label: CharacterTemplates.FateCorePolish,
    },
    {
      group: "Tachyon Squadron",
      label: CharacterTemplates.TachyonSquadronCharacter,
    },
    {
      group: "Tachyon Squadron",
      label: CharacterTemplates.TachyonSquadronShip,
    },
    {
      group: "Tachyon Squadron",
      label: CharacterTemplates.TachyonSquadronCharacterAndShip,
    },
    {
      group: "Evolution Pulse",
      label: CharacterTemplates.EvolutionPulseHydrah,
    },
    {
      group: "Evolution Pulse",
      label: CharacterTemplates.EvolutionPulseHyonos,
    },
    {
      group: "Evolution Pulse",
      label: CharacterTemplates.EvolutionPulseLostH,
    },
    {
      group: "Evolution Pulse",
      label: CharacterTemplates.EvolutionPulseObscura,
    },
    {
      group: "Evolution Pulse",
      label: CharacterTemplates.EvolutionPulseProxy,
    },
    {
      group: "Dresden Files RPG",
      label: CharacterTemplates.DresdenFilesRPGCharacter,
    },
    {
      group: "Dresden Files RPG",
      label: CharacterTemplates.DresdenFilesRPGSpellCaster,
    },
    {
      group: "Dresden Files RPG",
      label: CharacterTemplates.DresdenFilesRPGVampire,
    },
    { group: "Maze", label: CharacterTemplates.Maze },
    {
      group: "Tunnels & Trolls",
      label: CharacterTemplates.TunnelsAndTrolls,
    },
    { group: "The Pool", label: CharacterTemplates.ThePool },
    { group: "Dungeons & Dragons", label: CharacterTemplates.Dnd5e },
    { group: "Grant Howitt", label: CharacterTemplates.TheWitchIsDead },
    { group: "Star Wars", label: CharacterTemplates.EdgeOfTheEmpire },
    {
      group: "Star Wars",
      label: CharacterTemplates.EdgeOfTheEmpireFrench,
    },
    {
      group: "TROIKA! Numinous Edition",
      label: CharacterTemplates.TroikaNuminousEdition,
    },
    { group: "Blank", label: CharacterTemplates.Blank },
  ];
