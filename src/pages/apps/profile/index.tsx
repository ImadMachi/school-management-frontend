// ** Next Import
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import UserProfile from 'src/views/apps/profile/UserProfile'
import { useAuth } from 'src/hooks/useAuth'

// ** Types

const UserProfileTab = () => {
  const data = useAuth()
  return <UserProfile data={data.user} />
}

// export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
//   const data = UserType;

//   return {
//     props: {
//       data   
//      }
//   }
//}

export default UserProfileTab
