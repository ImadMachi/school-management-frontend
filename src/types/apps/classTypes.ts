import { AdministratorType } from "./administratorTypes";
import { LevelType } from "./levelTypes";
import { StudentsType } from "./studentTypes";
import { SubjectType } from "./subjectTypes";
import { TeachersType } from "./teacherTypes";

export type ClassType = {
  id: number;
  name: string;
  schoolYear: string;
  students: StudentsType[];
  teachers: TeachersType[];
  administrators: AdministratorType[];
  level: LevelType;
  subjects: SubjectType[];
};
