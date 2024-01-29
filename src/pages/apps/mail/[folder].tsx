// ** Types
import { useRouter } from 'next/router'

// ** Demo Components Imports
import Email from 'src/views/apps/mail/Mail'

const EmailApp = () => {
  const router = useRouter()
  const { folder } = router.query

  // @ts-ignore
  return <Email folder={folder} />
}

EmailApp.contentHeightFixed = true

export default EmailApp
