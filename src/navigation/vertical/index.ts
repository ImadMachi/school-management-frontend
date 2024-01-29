// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: '/apps/administrateurs',
      action: 'manage',
      subject: 'administrator',
      title: 'Administrateurs',
      icon: 'mdi:shield'
    },
    {
      path: '/apps/teachers',
      action: 'manage',
      subject: 'enseignants',
      title: 'Enseignants',
      icon: 'mdi:teacher'
    },
    {
      path: '/apps/mail',
      title: 'Messages',
      icon: 'mdi:email'
    },
    {
      path: '/apps/students',
      action: 'manage',
      subject: 'student',
      title: 'Étudients',
      icon: 'mdi:school'
    }
  ]
}

export default navigation
