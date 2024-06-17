import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Icon } from '@iconify/react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import { fetchStatistics } from 'src/store/apps/statistics'
import { RootState } from 'src/store'
import SchoolIcon from '@mui/icons-material/School'
import ClassIcon from '@mui/icons-material/Class'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

const AnalyticsStatisticsCard = () => {
  const dispatch = useDispatch()
  const statistics = useSelector((state: RootState) => state.statistics.data)

  useEffect(() => {
    dispatch(fetchStatistics() as any)
  }, [dispatch])

  if (!statistics) return null

  return (
    <Card>
      {/* <CardHeader
        title='Tableau de bord du Statistics'
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
          />
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Overview of current statistics
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      /> */}
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        {/* User Statistics Header */}
        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'text.secondary' }}>
          Utilisateurs
        </Typography>

        {/* User Statistics */}
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='primary'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:account-cog'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Administrators</Typography>
                <Typography variant='h6'>{statistics.administratorsCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='success'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:account-tie'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Directors</Typography>
                <Typography variant='h6'>{statistics.directorsCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='warning'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:teacher'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Teachers</Typography>
                <Typography variant='h6'>{statistics.teachersCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='info'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:account-child'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Parents</Typography>
                <Typography variant='h6'>{statistics.parentsCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='error'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:support'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Agents</Typography>
                <Typography variant='h6'>{statistics.agentsCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='secondary'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <Icon icon={'mdi:school'} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Students</Typography>
                <Typography variant='h6'>{statistics.studentsCount}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Level Statistics Header */}
        <Typography variant='h6' sx={{ mt: 6, mb: 3, fontWeight: 600, color: 'text.secondary' }}>
          Niveaux
        </Typography>

        {/* Level Statistics */}
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='success'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <SchoolIcon />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Cycles</Typography>
                <Typography variant='h6'>{statistics.cyclesCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='warning'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <ClassIcon />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Levels</Typography>
                <Typography variant='h6'>{statistics.levelsCount}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='info'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <ClassIcon />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Classes</Typography>
                <Typography variant='h6'>{statistics.classesCount}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Absence Statistics Header */}
        <Typography variant='h6' sx={{ mt: 6, mb: 3, fontWeight: 600, color: 'text.secondary' }}>
          Absences
        </Typography>

        {/* Absence Statistics */}
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                variant='rounded'
                color='secondary'
                sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
              >
                <EventAvailableIcon />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Absences</Typography>
                <Typography variant='h6'>{statistics.absencesCount}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsStatisticsCard
