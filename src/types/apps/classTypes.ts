import { AdministratorType } from "./administratorTypes";
import { StudentsType } from "./studentTypes";
import { TeachersType } from "./teacherTypes";

export type ClassType = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  students: StudentsType[];
  teachers: TeachersType[];
  administrator: AdministratorType;
};
