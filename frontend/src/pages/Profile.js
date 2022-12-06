import * as React from 'react';
import Page from '../components/Page';
import { Box, Grid, Button, Container, Typography } from '@mui/material';
import Iconify from '../components/Iconify';
import {
  AppWidgetProfile,
} from '../sections/@dashboard/app';

import { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ProductList } from '../sections/@dashboard/products';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../store/auth'

export default function Profile() {

  const dispatch = useDispatch()
  let exp = useSelector(state => state.auth.exp);
  const navigate = useNavigate()

  useEffect(() => {
    if (exp<parseInt(Date.now()/1000)) {
      dispatch(authActions.logout())
      navigate('/', {replace: true});
    }
  }, [dispatch, exp, navigate]);

   const userId = useSelector(state => state.auth.userId);
   let token = useSelector(state => state.auth.token)

  const [height, setHeight] = useState(null)
  const [weight, setWeight] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [alignment, setAlignment] = useState('your');
  const [myWorkouts, setWorkouts] = useState([]);
  const [favWorkouts, setFavWorkouts] = useState([]);
  const [next, setNext] = useState();

  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const fetchData = () => {

    fetch(global.config.url + "accounts/profiles/" +userId, {
      headers: {
        Authorization: "Bearer " +token
      },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        setHeight(data.height)
        setWeight(data.weight)
        setFirstName(data.user.first_name)
        setLastName(data.user.last_name)
        setPhoto(data.profile_picture)
        console.log(data.profile_picture)
      })
  }

  

  const fetchWorkout = () => {

    fetch(global.config.url+ "workouts/plans/", {
      headers: {
        Authorization: "Bearer " +token
      },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        const workouts = []
        const fav = []
        for (let i = 0; i < data.results.length; i++){
          if(data.results[i].author.id === userId){
            workouts.push(data.results[i])
          }
          if(data.results[i].is_favorite === true){
            fav.push(data.results[i])
          }
        }
        setNext(data.next)
        setWorkouts(workouts);
        setFavWorkouts(fav);
      })
  }


  useEffect(() => {
    fetchData()
    fetchWorkout()
  }, )


const fetchNextWorkout = () => {
  if(next){
  fetch(next, {
    headers: {
      Authorization: "Bearer " +token
    },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        const workouts = myWorkouts
        const fav = favWorkouts
        for (let i = 0; i < data.results.length; i++){
          if(data.results[i].author.id === userId){
            workouts.push(data.results[i])
          }
            if(data.results[i].is_favorite === true){
              fav.push(data.results[i])
            }
        }
        setNext(data.next)
        setWorkouts(workouts);
        setFavWorkouts(fav);
      })
    }
  }
  return (
    <Page title="Profile">
      <Container component="main" maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 5 }}>
          Gymshare - view Your Profile
        </Typography>

        <Grid container spacing={1} >

          <Grid item xs={12} sm={12} md={12}>
            <AppWidgetProfile name={firstName} last={lastName} height={height} weight={weight} photo={photo} color="secondary" />
          </Grid>
          </Grid>
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: "primary.main",
          }}
        >
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange1}
      aria-label="Platform"
      size='large'
    >
      <ToggleButton size='medium' value="your">Your Workouts</ToggleButton>
      <ToggleButton size='medium' value="liked">Liked Workouts</ToggleButton>
    </ToggleButtonGroup>
    </Box>
    {alignment==='your' && <Box>
    <ProductList products={myWorkouts} />
     <Box m={3} pt={5}>
        <Button style={{margin: '0 auto', display: "flex"}} variant="contained" onClick={fetchNextWorkout} startIcon={<Iconify icon="eva:plus-fill" />}>
            See more
          </Button>
          </Box>
          </Box>}
    {alignment==='liked' && <Box>
    <ProductList products={favWorkouts} />
     <Box m={3} pt={5}>
        <Button style={{margin: '0 auto', display: "flex"}} variant="contained" onClick={fetchNextWorkout} startIcon={<Iconify icon="eva:plus-fill" />}>
            See more
          </Button>
          </Box>
          </Box>}
      </Container>
      </Page>
  );
}