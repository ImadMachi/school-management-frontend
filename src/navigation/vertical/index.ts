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
      path: '/apps/enseignants',
      action: 'manage',
      subject: 'enseignants',
      title: 'Enseignants',
      icon: 'mdi:teacher'
    }
    
  ]
}

export default navigation
