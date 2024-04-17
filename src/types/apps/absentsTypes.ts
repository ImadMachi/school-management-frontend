import { UserType } from "./UserType";

export type AbsentsType = {
  id: number;
  datedebut: Date;
  datefin: Date;
  reason: string;
  justified: boolean;
  absentUser: UserType;
  replaceUser: UserType[];
  title: string;
  body: string;
  status: string;
};
