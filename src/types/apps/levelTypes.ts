import { ClassType } from "./classTypes";

export type LevelType = {
  id: number;
  name: string;
  schoolYear: string;
  classes: ClassType[];
};
