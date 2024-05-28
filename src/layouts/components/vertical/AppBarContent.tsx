// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import Link from '@mui/material/Link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'  // Adjust the import according to your store file structure
import { useEffect } from 'react'
import { fetchData as fetchAbsences} from 'src/store/apps/absences'

// ** Absence Type Import

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent: React.FC<Props> = (props: Props) => {

  const dispatch = useDispatch<AppDispatch>();

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Redux State
  const absenceStore = useSelector((state: RootState) => state.absences)

  // ** Check if absences is an array and has untreated absences
  const absence = absenceStore.data.find((abs) => abs.status === 'not treated');

  useEffect(() => {
    dispatch(fetchAbsences() as any)
  },[])
    

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {absence && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            message={
              <span>
                <strong>Absences non traitées :</strong> {' '}
                <Link href='/apps/absences/' style={{ color: '#fff' }}>Cliquez ici pour les voir</Link>
              </span>
            }
            sx={{ backgroundColor: '#f57579' }}
          />
        </Snackbar>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {hidden ? (
            <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
              <Icon icon='mdi:menu' />
            </IconButton>
          ) : null}
          <ModeToggler settings={settings} saveSettings={saveSettings} />
        </Box>
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </Box>
  )
}
export default AppBarContent;
