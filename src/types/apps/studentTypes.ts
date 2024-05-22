import { ClassType } from "./classTypes";
import { ParentsType } from "./parentTypes";

export type StudentsType = {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  dateOfBirth: Date;
  sex: string;
  disabled: boolean;
  userId: number;
  classe: ClassType;
  parent: ParentsType;

  user: {
    disabled: boolean;
  };
};
