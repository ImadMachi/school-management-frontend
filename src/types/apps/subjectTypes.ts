import { ClassType } from "./classTypes";
import { TeachersType } from "./teacherTypes";

export type SubjectType = {
  id: number;
  name: string;
  disabled: boolean;
  teachers: TeachersType[];
  // classes: ClassType[];
};
