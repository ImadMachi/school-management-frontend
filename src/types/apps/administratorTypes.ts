export type AdministratorType = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  disabled: boolean;
  userId: number
  user: { 
    id: number
    email: string
    profileImage: File
  }
}