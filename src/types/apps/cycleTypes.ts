import { LevelType } from "./levelTypes";

export type CycleType = {
  id: number;
  name: string;
  disabled: boolean;
  levels: LevelType[];
};
