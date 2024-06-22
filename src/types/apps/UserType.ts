export type UserType = {
  id: number;
  email: string;
  password?: string;
  disabled: boolean;
  lastLogin?: string;
  isActive: boolean;
  role: string;
  profileImage?: string;
  // totalAbsences: number;
  // justifiedAbsences: number;
  // unjustifiedAbsences: number;
  // totalDaysAbsent: number;
  // totalSessionsAbsent: number;
  // totalReplacements: number;
  // uniqueReplacementDays: number;
  // totalSessionsReplaced: number;

  userData: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    fatherFirstName?: string;
    fatherLastName?: string;
    motherFirstName?: string;
    motherLastName?: string;
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
