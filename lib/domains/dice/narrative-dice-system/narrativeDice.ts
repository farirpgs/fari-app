export type EdgeDice = {
  success: number;
  failure: number;
  advantage: number;
  threat: number;
  triumph: number;
  despair: number;
};

export const defaultEdgeDice: EdgeDice = {
  success: 0,
  failure: 0,
  advantage: 0,
  threat: 0,
  triumph: 0,
  despair: 0,
};

// positive
export const faceOneSuccess: EdgeDice = {
  ...defaultEdgeDice,
  success: 1,
};

export const faceTwoSuccesses: EdgeDice = {
  ...defaultEdgeDice,
  success: 2,
};
export const faceOneAdvantage: EdgeDice = {
  ...defaultEdgeDice,
  advantage: 1,
};
export const faceTwoAdvantages: EdgeDice = {
  ...defaultEdgeDice,
  advantage: 2,
};
export const faceOneSuccessOneAdvantage: EdgeDice = {
  ...defaultEdgeDice,
  success: 1,
  advantage: 1,
};
export const faceTriumph: EdgeDice = {
  ...defaultEdgeDice,
  triumph: 1,
};

// negative
export const faceOneFailure: EdgeDice = {
  ...defaultEdgeDice,
  failure: 1,
};
export const faceTwoFailures: EdgeDice = {
  ...defaultEdgeDice,
  failure: 2,
};
export const faceOneThreat: EdgeDice = {
  ...defaultEdgeDice,
  threat: 1,
};
export const faceTwoThreats: EdgeDice = {
  ...defaultEdgeDice,
  threat: 2,
};
export const faceOneFailureOneThreat: EdgeDice = {
  ...defaultEdgeDice,
  failure: 1,
  threat: 1,
};
export const faceDespair: EdgeDice = {
  ...defaultEdgeDice,
  despair: 1,
};

// neutral
export const faceBlank: EdgeDice = {
  ...defaultEdgeDice,
};

// DICE
export const green_die = {
  name: "Ability Die",
  faces: [
    faceOneSuccess,
    faceOneAdvantage,
    faceOneSuccessOneAdvantage,
    faceTwoSuccesses,
    faceOneAdvantage,
    faceOneSuccess,
    faceTwoAdvantages,
    faceBlank,
  ],
};
export const yellow_die = {
  name: "Proficiency Die",
  faces: [
    faceTwoAdvantages,
    faceOneAdvantage,
    faceTwoAdvantages,
    faceTriumph,
    faceOneSuccess,
    faceOneSuccessOneAdvantage,
    faceOneSuccess,
    faceOneSuccessOneAdvantage,
    faceTwoSuccesses,
    faceOneSuccessOneAdvantage,
    faceTwoSuccesses,
    faceBlank,
  ],
};
export const blue_die = {
  name: "Boost Die",
  faces: [
    faceOneSuccessOneAdvantage,
    faceOneAdvantage,
    faceTwoAdvantages,
    faceBlank,
    faceOneSuccess,
    faceBlank,
  ],
};
export const purple_die = {
  name: "Difficulty Die",
  faces: [
    faceOneThreat,
    faceOneFailure,
    faceOneFailureOneThreat,
    faceOneThreat,
    faceBlank,
    faceTwoThreats,
    faceTwoFailures,
    faceOneThreat,
  ],
};
export const red_die = {
  name: "Challenge Die",
  faces: [
    faceTwoThreats,
    faceOneThreat,
    faceTwoThreats,
    faceOneThreat,
    faceOneFailureOneThreat,
    faceOneFailure,
    faceOneFailureOneThreat,
    faceOneFailure,
    faceTwoFailures,
    faceDespair,
    faceTwoFailures,
    faceBlank,
  ],
};
export const black_die = {
  name: "Setback Die",
  faces: [
    faceBlank,
    faceBlank,
    faceOneThreat,
    faceOneThreat,
    faceOneFailure,
    faceOneFailure,
  ],
};
