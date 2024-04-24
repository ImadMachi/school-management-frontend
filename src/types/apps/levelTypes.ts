import { ClassType } from "./classTypes";
import { CycleType } from "./cycleTypes";

export type LevelType = {
  id: number;
  name: string;
  classes: ClassType[];
  cycle: CycleType;
};
