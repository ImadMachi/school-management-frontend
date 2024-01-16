import { UserType } from './UserType'

export type AdministratorType = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  user: UserType
}
