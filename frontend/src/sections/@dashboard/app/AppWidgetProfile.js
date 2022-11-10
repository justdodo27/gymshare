// @mui
import Iconify from '../../../components/Iconify';
import { Card, Typography, Divider, Stack, Button, Avatar, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import account from '../../../_mock/account';


export default function AppWidgetProfile({ name, last, height, weight, photo, color = 'primary', sx, ...other }) {
  let src = 'http://localhost:1337/'
  if(photo){
    src = src + photo
  }else{
    src = account.photoURL
  }
  console.log(src)
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
      <Grid container spacing={1} >
        <Grid item xs={2} sm={2} md={2}>
      <Avatar  sx={{ margin: 1, width: '110%', height: '90%' }} src={src} alt="photoURL" />
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
        <Typography padding={2} margin={2} variant="h3" sx={{ opacity: 0.72 }}>
        {name} {last}
      </Typography>
      <Typography variant="subtitle1">Height: {height}cm</Typography>
      <Typography variant="subtitle1">Weight: {weight}kg</Typography>
      <Stack 
      padding={2} margin={2} 
      marginLeft={20}
      marginRight={20}
      divider={<Divider orientation="vertical" flexItem />} 
      direction="row" spacing={2} 
      justifyContent="center"
      alignItems="center">
          <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/EditProfile" >
            Edit Profile
          </Button>
          <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/addWorkout" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>
          <Button fullWidth color='info' variant="contained" component={RouterLink} to="/gymshare/ChangePassword" >
            Change Password
          </Button>
        </Stack>
        </Grid>
        </Grid>
    </Card>
  );
}
