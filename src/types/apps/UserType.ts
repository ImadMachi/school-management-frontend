export type UserType = {
  id: number;
  email: string;
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
}
