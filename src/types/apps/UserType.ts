export type UserType = {
  id: number;
  email: string;
  password?: string;
  disabled: boolean;
  isActive: boolean;
  role: string;
  profileImage?: string;
  userData: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
};

export enum UserRole {
  Director = "Director",
  Administrator = "Administrator",
  Teacher = "Teacher",
  Student = "Student",
  Parent = "Parent",
  Agent = "Agent",
}
