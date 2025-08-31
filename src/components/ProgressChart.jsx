import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatDate } from '../utils/timeUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ 
  data, 
  type = 'line', 
  title, 
  yAxisLabel = '', 
  xAxisLabel = 'Date',
  height = 300,
  showLegend = true
}) => {
  const theme = useTheme();
  
  // Default options for charts
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // Format the date in the tooltip title
            const item = tooltipItems[0];
            const label = item.label;
            return formatDate(label, 'MMMM d, yyyy');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          precision: 0
        }
      },
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };
  
  // Apply theme colors to datasets if not specified
  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      // Default colors based on theme
      const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main
      ];
      
      return {
        ...dataset,
        borderColor: dataset.borderColor || colors[index % colors.length],
        backgroundColor: dataset.backgroundColor || (
          type === 'line' 
            ? `${colors[index % colors.length]}33` // Add transparency for fill
            : colors[index % colors.length]
        ),
        tension: dataset.tension || 0.4
      };
    })
  };
  
  // Additional options for line charts
  const lineOptions = {
    ...options,
    elements: {
      line: {
        tension: 0.4
      }
    }
  };
  
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      {title && !options.plugins.title.display && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box sx={{ height, position: 'relative' }}>
        {type === 'line' ? (
          <Line data={chartData} options={lineOptions} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </Box>
    </Paper>
  );
};

export default ProgressChart;

