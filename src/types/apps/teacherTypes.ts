import { SubjectType } from "./subjectTypes";

export type TeachersType = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  dateOfEmployment: Date;
  sex: string;
  disabled: boolean;
  subjects: string;
  userId: number;
  user: {
    disabled: boolean;
  };
};
