export type ISeelieSquireCharacter = {
  name: string;
  aspects: Array<string>;
  tracks: Array<{
    name: string;
    values: Array<string>;
  }>;
  skills: Array<string>;
  stunts: Array<{
    name: string;
    description: string;
  }>;
  slots: Array<{
    name: string;
    value: string;
  }>;
};

export type ICreature = {
  title: string;
  description: string;
  image?: string;
  notes?: string;
  character: Array<ISeelieSquireCharacter>;
};
