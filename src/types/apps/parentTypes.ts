import { StudentsType } from "./studentTypes"

export type ParentsType = {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    disabled: boolean;
    students : StudentsType[];
    userId: number;
  }
  