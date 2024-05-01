import { UserType } from "./UserType";

export enum AbsenceStatus {
  NOT_TREATED = "not treated",
  TREATING = "treating",
  TREATED = "treated",
}

interface Session {
  id: number;
  user: UserType;
}

interface AbsenceDay {
  id: number;
  date: string;
  sessions: Session[];
}

export type AbsenceType = {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  justified: boolean;
  absentUser: UserType;
  status: AbsenceStatus;
  absenceDays: AbsenceDay[];
};

export interface AddAbsenceType {
  startDate: string;
  endDate: string;
  reason: string;
  absentUser: number | string;
}
