// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalAbsencesPerDay } from 'src/store/apps/absences';
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts';

// ** Util Import
import { useEffect } from 'react';
import { RootState } from 'src/store';
import { ApexOptions } from 'apexcharts';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import { fetchStatistics } from 'src/store/apps/statistics';

interface AbsenceData {
  date: string;
  count: number;
}

const TotalAbsencesPerDay = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const totalAbsencesPerDay = useSelector((state: RootState) => state.absences.totalAbsencesPerDay as AbsenceData[]);
  const statistics = useSelector((state: RootState) => state.statistics.data)


  // Fetch total absences per day when component mounts
  useEffect(() => {
    dispatch(fetchTotalAbsencesPerDay() as any);
    dispatch(fetchStatistics() as any)

  }, [dispatch]);

  // Extract dates and counts for the chart
  const dates = totalAbsencesPerDay.map(item => item.date);
  const counts = totalAbsencesPerDay.map(item => item.count);


  // Find the day with maximum absences
  const maxAbsences = Math.max(...counts);
  const maxAbsenceDay = totalAbsencesPerDay.find(day => day.count === maxAbsences);

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    grid: {
      show: false,
      padding: {
        top: 10,
        left: 30, // More left padding to prevent bars from sticking to Y-axis
        right: 10,
        bottom: 10
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10, // Rounded edges
        distributed: true,
        columnWidth: '60%', // Adjust column width for balanced appearance
        endingShape: 'rounded', // Rounded ends for bars
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: counts.map(count =>
      count === maxAbsences ? theme.palette.error.main : hexToRGBA(theme.palette.primary.main, 0.8)
    ),
    states: {
      hover: {
        filter: { type: 'lighten', value: 0.1 }
      },
      active: {
        filter: { type: 'darken', value: 0.1 }
      }
    },
    xaxis: {
      categories: dates,
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '12px',
          colors: theme.palette.text.disabled
        },
        offsetY: 5 // Add space to prevent overlap with X-axis
      }
    },
    yaxis: {
      max: 5,
      labels: {
        formatter: (value) => value.toFixed(0),
        style: {
          fontSize: '12px',
          colors: theme.palette.text.disabled
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (value) => `${value} absences`
      }
    }
  };

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        title='Absences Annuelles'
        subheader='Total des Absences par Jour'
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' } }}
      />
      <CardContent sx={{ pt: `${theme.spacing(3)} !important` }}>
        <ReactApexcharts
          type='bar'
          height={350} // Increased height for taller bars
          options={options}
          series={[{ data: counts }]}
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Total des Absences: {statistics?.absencesCount  }
          </Typography>
          {maxAbsenceDay && (
            <Typography variant="body2" color="error">
              Maximum: {maxAbsenceDay.count} le {maxAbsenceDay.date}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalAbsencesPerDay;
