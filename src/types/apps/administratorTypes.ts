export type AdministratorType = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  userId: number
  user: { 
    id: number
    email: string
    profileImage: File
  }

}
