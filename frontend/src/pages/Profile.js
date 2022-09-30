import * as React from 'react';
import { useRef } from "react";
import Page from '../components/Page';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Button, Container, Stack, Typography } from '@mui/material';
import Iconify from '../components/Iconify';
import {
  AppWidgetSummary,
  AppWidgetProfile,
} from '../sections/@dashboard/app';
import { useTheme } from '@mui/material/styles';

import { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ProductSort, ProductList, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';

export default function Profile() {
  const theme = useTheme();
  const listInnerRef = useRef();
   const userId = useSelector(state => state.auth.userId);
   const username = useSelector(state => state.auth.username);
   let token = useSelector(state => state.auth.token)

  const [height, setHeight] = useState(null)
  const [weight, setWeight] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [alignment, setAlignment] = useState('your');
  const [myWorkouts, setWorkouts] = useState([]);
  const [favWorkouts, setFavWorkouts] = useState([]);
  const [next, setNext] = useState();

  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const fetchData = () => {

    fetch("http://localhost:1337/accounts/profiles/" +userId, {
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
        
      })
  }

  const fetchWorkout = () => {

    fetch("http://localhost:1337/workouts/plans/", {
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
        console.log(data.results.length)
        for (let i = 0; i < data.results.length; i++){
          if(data.results[i].author.id == userId){
            workouts.push(data.results[i])
          }
          if(data.results[i].is_favorite == true){
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
  }, [])


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
          if(data.results[i].author.id == userId){
            workouts.push(data.results[i])
          }
            if(data.results[i].is_favorite == true){
              fav.push(data.results[i])
            }
        }
        setNext(data.next)
        setWorkouts(workouts);
        setFavWorkouts(fav);
      })
    }
  }
  
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        console.log("reached bottom");
        fetchNextWorkout(next)
      }
    }
  };

  
  return (
    <Page title="Profile">
      <Container component="main" maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 5 }}>
          Gymshare - train more effectively
        </Typography>

        <Grid container spacing={3} >

          <Grid item xs={12} sm={6} md={12}>
            <AppWidgetProfile name={firstName} last={lastName} height={height} weight={weight} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
          >
      <Button variant="contained" component={RouterLink} to="/gymshare/EditProfile" style={{ minWidth: '40vh'}}>
            Edit Profile
          </Button>
          </Box>
          </Grid>
          
          </Grid>
        <Box sx={{
            marginTop: 8,
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: "primary.main",
          }}
          >
      <Button variant="contained" component={RouterLink} to="/gymshare/addWorkout" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>
          </Box>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 10,
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
    {alignment==='your' && <div
            onScroll={onScroll}
            ref={listInnerRef}
            style={{ height: "400px", overflowY: "auto" }}>
    <ProductList products={myWorkouts} />
    </div>}
    {alignment==='liked' && <div
            onScroll={onScroll}
            ref={listInnerRef}
            style={{ height: "400px", overflowY: "auto" }}>
    <ProductList products={favWorkouts} />
    </div>}
      </Container>
      </Page>
  );
}