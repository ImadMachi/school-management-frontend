import { UserType } from "./UserType";

export type GroupType = {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  isActive: boolean;
  administratorUsers: UserType[];
  users: UserType[];
};
