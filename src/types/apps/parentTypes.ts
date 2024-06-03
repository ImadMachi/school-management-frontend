import { StudentsType } from "./studentTypes";

export type ParentsType = {
  id: number;
  fatherFirstName: string;
  fatherLastName: string;
  fatherPhoneNumber: string;
  motherFirstName: string;
  motherLastName: string;
  motherPhoneNumber: string;
  address: string;

  user: {
    disabled: boolean;
  };
};
