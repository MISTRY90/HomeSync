// src/components/Card.jsx
import { Typography, Stack, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const Card = ({ title, value, comparison }) => {
  const theme = useTheme();
  const isPositive = comparison?.percentage >= 0;
  const ComparisonIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
        {comparison && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ComparisonIcon 
              fontSize="small" 
              sx={{ color: isPositive ? theme.palette.success.main : theme.palette.error.main }}
            />
            <Typography 
              variant="body2"
              sx={{ color: isPositive ? theme.palette.success.main : theme.palette.error.main }}
            >
              {Math.abs(comparison.percentage)}% {comparison.label}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};