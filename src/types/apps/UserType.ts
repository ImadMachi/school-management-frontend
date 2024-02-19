export type UserType = {
  id: number;
  email: string;
  isActive: boolean;
  role: string;
  userData: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
};

export enum UserRole {
  Administrator = "Administrator",
  Teacher = "Teacher",
  Student = "Student",
  Parent = "Parent",
  Director = "Director",
}
