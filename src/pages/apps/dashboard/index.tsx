// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports

import AnalyticsTransactionsCard from 'src/views/apps/dashboard/AnalyticsTransactionsCard'
import TotalAbsencesPerDay from 'src/views/apps/dashboard/TotalAbsencePerDay'

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>

        <Grid item xs={12} md={8}>
          <AnalyticsTransactionsCard />
        </Grid>


        {/* <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
    
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='$25.6k'
                icon={<Icon icon='mdi:poll' />}
                color='secondary'
                trendNumber='+42%'
                title='Total Profit'
                subtitle='Weekly Profit'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='862'
                trend='negative'
                trendNumber='-18%'
                title='New Project'
                subtitle='Yearly Project'
                icon={<Icon icon='mdi:briefcase-variant-outline' />}
              />
            </Grid>

          </Grid>
        </Grid> */}
         <Grid item xs={12} mt={8}>
          <TotalAbsencesPerDay />
        </Grid>

    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
