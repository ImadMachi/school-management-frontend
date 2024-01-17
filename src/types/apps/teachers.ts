import { UserType } from './UserType'

export type TeachersType = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: Date
  dateOfHiring: Date
  sexe: string
  user: UserType
}
