// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: '/apps/administrator',
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
      path: '/apps/students',
      action: 'manage',
      subject: 'student',
      title: 'Étudients',
      icon: 'mdi:school'
    },

    
  ]
}

export default navigation
