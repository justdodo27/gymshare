import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import React, { useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Button, Stack, Typography, Box, Menu, MenuItem } from '@mui/material';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import { ProductList } from '../sections/@dashboard/products';
// mock
import { useSelector} from 'react-redux';
import { authActions } from '../store/auth'
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { sortActions } from '../store/sort';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {forwardRef} from 'react';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
// ----------------------------------------------------------------------
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function EcommerceShop() {

  const dispatch = useDispatch()
  let exp = useSelector(state => state.auth.exp);
  let token = useSelector(state => state.auth.token);
  const navigate = useNavigate()
  let isAuth = useSelector(state => state.auth.isAuthenticated);
  let autoLogout = useSelector(state => state.auth.logout);
  let termState = useSelector(state => state.sort.term)
  let arrowState = useSelector(state => state.sort.arrow)
  let sortState = useSelector(state => state.sort.sort)
  const [open, setOpen] = useState(null);
  const [term, setTerm] = useState(termState);
  const [styleAlert, setStyleAlert] = useState(false);
  const [addAlert, setAddAlert] = useState(false);
  const [sort, setSort] = useState(sortState);
  const [arrow, setArrow] = useState(arrowState)

  const handleCloseAlert = (event, reason) => {
    if(styleAlert){
      navigate('/gymshare/app', { replace: true });
    }
    if (reason === 'clickaway') {
      return;
    }

    setAddAlert(false);
  };

  const SORT_BY_OPTIONS = [
    { value: 'id', label: 'Order' },
    { value: 'title', label: 'Title' },
    { value: 'avg_rating', label: 'Rate' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'avg_time', label: 'Workout Time' },
    { value: 'sum_of_cb', label: 'Calories Burned' },
  ];

  const handleSort = (value, label) => {
    handleClose();
    setSort({ value: value, label: label });
    if(sort.value === value){
      setArrow(!arrow)
    }

  }

  useEffect(() => {
    if (autoLogout) {
      setAddAlert(true);
      setStyleAlert(false)
      dispatch(authActions.autoLogout())
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuth && exp<parseInt(Date.now()/1000)) {
      dispatch(authActions.logout())
      navigate('/', {replace: true});
    }
  }, [dispatch, exp, navigate]);

  

  const [workouts, setWorkouts] = useState([]);
  const [next, setNext] = useState();

  const fetchWorkout = (s, term='') => {
    let option = ''
    if(!arrow){
      option = '-'
    }
    option = option + s
    console.log(arrow, sort, option)
    fetch("http://localhost:1337/workouts/plans/?visibility=Public&page=1&ordering="+option+"&search="+term, {
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
        fetchWorkout(sort.value, term)
        dispatch(sortActions.getSortStats([term, arrow, sort]))
    } catch (error) {
      
    }
  }, [sort,arrow, term])

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


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Page title="Workouts">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Gymshare - Train more effectively
          </Typography>
          {isAuth && <Button variant="contained" component={RouterLink} to="/gymshare/addWorkout" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Workout
          </Button>}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={term}
              inputProps={{ 'aria-label': 'search' }}
              onInput={(e) => {
                setTerm(e.target.value);
              }}
            />
          </Search>
        <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sort.label}
        {!arrow && <SouthIcon fontSize="inherit" />}
        {arrow && <NorthIcon fontSize="inherit" />}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort.value}
            onClick={() => {handleSort(option.value, option.label)}}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

        </Stack>
        {workouts && <ProductList products={workouts} />}
        <Box m={3} pt={5}>
        {workouts.length>14 && <Button style={{margin: '0 auto', display: "flex"}} variant="contained" onClick={fetchNextWorkout} startIcon={<Iconify icon="eva:plus-fill" />}>
            See more
          </Button>}
          </Box>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal:'center' }} open={addAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={(styleAlert === true && 'success') || 'warning'} sx={{ width: '100%' }}>
{!styleAlert && <Typography>You have been logged out!</Typography>}
        </Alert>
      </Snackbar>
      </Container>
    </Page>
    
  );
}
