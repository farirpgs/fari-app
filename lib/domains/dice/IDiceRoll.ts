export interface IDiceRoll {
  total: number;
  bonus?: number;
  bonusLabel?: string;
  rolls: Array<number>;
}
