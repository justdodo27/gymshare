import { useState, useEffect } from 'react';
import React, { useRef } from "react";

import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Button, Stack, Typography } from '@mui/material';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import { useSelector} from 'react-redux';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const listInnerRef = useRef();
  let isAuth = useSelector(state => state.auth.isAuthenticated);

  const [openFilter, setOpenFilter] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [next, setNext] = useState();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const fetchWorkout = () => {

    fetch("http://localhost:1337/workouts/plans/?visibility=Public&page=1", {
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        const myWorkouts = []
        for (let i = 0; i < data.results.length; i++){
            if (data.results[i].visibility === 'Public'){
              myWorkouts.push(data.results[i])
            }
        }
        setNext(data.next)
        
        setWorkouts(myWorkouts);
      })
  }

  useEffect(() => {
    try {
        fetchWorkout()
    } catch (error) {
      
    }
  }, [])


const fetchNextWorkout = () => {
  if(next){
  fetch(next, {
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        const myWorkouts = workouts
        for (let i = 0; i < data.results.length; i++){
            if (data.results[i].visibility === 'Public'){
              myWorkouts.push(data.results[i])
            }
        }
        setNext(data.next)
        
        setWorkouts(myWorkouts);
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
    <Page title="Workouts">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Workouts
          </Typography>
          {isAuth && <Button variant="contained" component={RouterLink} to="/gymshare/addWorkout" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>}
        </Stack>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>
          <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "400px", overflowY: "auto" }}
      >
        {workouts && <ProductList products={workouts} />}
        </div>
      </Container>
    </Page>
    
  );
}
