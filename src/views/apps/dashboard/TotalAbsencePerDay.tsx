import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalAbsencesPerDay } from 'src/store/apps/absences';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
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
  const statistics = useSelector((state: RootState) => state.statistics.data);

  const [hoveredData, setHoveredData] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    dispatch(fetchTotalAbsencesPerDay() as any);
    dispatch(fetchStatistics() as any);
  }, [dispatch]);

  const dates = totalAbsencesPerDay.map(item => item.date);
  const counts = totalAbsencesPerDay.map(item => item.count);

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
      },
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          const { dataPointIndex } = config;
          const date = dates[dataPointIndex];
          const count = counts[dataPointIndex];
          const { clientX: x, clientY: y } = event;
          setHoveredData({ date, count, x, y });
        },
        dataPointMouseLeave: () => {
          setHoveredData(null);
        }
      }
    },
    grid: {
      show: false,
      padding: {
        top: 10,
        left: 30,
        right: 10,
        bottom: 10
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
        columnWidth: '60%',
        endingShape: 'rounded',
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
        offsetY: 5
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
      enabled: false
    }
  };

  return (
    <Card sx={{ boxShadow: 3, position: 'relative' }}>
      <CardHeader
        title='Absences Annuelles'
        subheader='Total des Absences par Jour'
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' } }}
      />
      <CardContent sx={{ pt: `${theme.spacing(3)} !important` }}>
        <ReactApexcharts
          type='bar'
          height={350}
          options={options}
          series={[{ data: counts }]}
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Total des Absences: {statistics?.absencesCount}
          </Typography>
          {maxAbsenceDay && (
            <Typography variant="body2" color="error">
              Maximum: {maxAbsenceDay.count} le {maxAbsenceDay.date}
            </Typography>
          )}
        </Box>
      </CardContent>

      {hoveredData && (
        <Box
          sx={{
            position: 'absolute',
            top: hoveredData.y - 20, 
            left: hoveredData.x - 10, 
            transform: 'translate(-150%, -350%)',
            backgroundColor: theme.palette.background.paper,
            padding: '4px 8px',
            boxShadow: 9,
            zIndex: 1000,
            pointerEvents: 'none',
            borderRadius: '4px', 
            fontSize: '10px' 
          }}
        >
          <Typography variant="body2" color="textSecondary">
            {hoveredData.date}
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {hoveredData.count} Absences
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default TotalAbsencesPerDay;
