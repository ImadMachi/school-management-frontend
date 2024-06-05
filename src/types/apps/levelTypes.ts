import { ClassType } from "./classTypes";
import { CycleType } from "./cycleTypes";

export type LevelType = {
  id: number;
  name: string;
  disabled: boolean;
  classes: ClassType[];
  cycle: CycleType;
};
