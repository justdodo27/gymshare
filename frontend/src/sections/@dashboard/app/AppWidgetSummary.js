// @mui
import PropTypes from 'prop-types';
import { Card, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Iconify from '../../../components/Iconify';


AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ color = 'primary', sx, ...other }) {
  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
        <Typography padding={2} margin={0}>
            <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/EditProfile" >
            Edit Profile
          </Button>
          </Typography>
          <Typography padding={2} margin={0}>
          <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/ChangePassword" >
            Change Password
          </Button>
          </Typography>
          <Typography padding={2} margin={0}>
          <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/addWorkout" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>
          </Typography>
    </Card>
  );
}
