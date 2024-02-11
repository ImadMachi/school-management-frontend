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
      path: '/apps/enseignants',
      action: 'manage',
      subject: 'enseignants',
      title: 'Enseignants',
      icon: 'mdi:teacher'
    },
    {
      path: '/apps/etudiants',
      action: 'manage',
      subject: 'étudiants',
      title: 'Étudients',
      icon: 'mdi:school'
    },
    {
      path: '/apps/mail',
      title: 'Messages',
      icon: 'mdi:email'
    }
  ]
}

export default navigation
