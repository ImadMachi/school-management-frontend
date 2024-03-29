import { AdministratorType } from "./administratorTypes";
import { LevelType } from "./levelTypes";
import { StudentsType } from "./studentTypes";
import { TeachersType } from "./teacherTypes";

export type ClassType = {
  id: number;
  name: string;
  schoolYear: string;
  students: StudentsType[];
  teachers: TeachersType[];
  administrator: AdministratorType;
  level : LevelType;
};
