export interface IBadGuy {
  id: string;
  name: string;
  aspects: string;
  skilledAt: string;
  badAt: string;
  stress: string;
  consequences: string;
  stressValues?: { [stressIndex: string]: boolean };
  consequencesValues?: { [stressIndex: string]: boolean };
}
