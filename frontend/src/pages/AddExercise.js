import * as React from 'react';
import { Avatar, TextField, Box, Grid, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import icon from "../pictures/icon.jpg"
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function AddExercise() {
  const theme = useTheme();

  const navigate= useNavigate();
  const [passwordError, setPasswordError] = useState(false)
  const [value, setValue] = React.useState(1);
  const [cbr, setCbr] = React.useState(0);
  const [type, setType] = React.useState('With own body weight');
  let passwordErrorCheck = false
  let token = useSelector(state => state.auth.token);
  let author = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    
  };
  const handleCbrChange = (event, newValue) => {
    setCbr(newValue/100);
    console.log(typeof cbr)
  };

  const handleVisibilityChange = (event) => {
    setType(event.target.value);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };
  const handleInputCbrChange = (event) => {
    setCbr(event.target.value === '' ? '' : Number(event.target.value));
  };


  const handleBlur = () => {
    if (value < 1) {
      setValue(1);
    } else if (value > 10) {
      setValue(10);
    }
    else if (((value*10) % 10) !== 0){
        setValue(1)
    }
  };
  const handleBlur2 = () => {
    if (cbr < 1) {
      setCbr(0.01);
    } else if (cbr > 5) {
      setCbr(5);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title')
    const description = data.get('description')

    console.log(title)
    console.log(description)
    console.log(type)
    console.log(value)
    console.log(cbr)

    fetch(global.config.url + "workouts/exercises/", {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        description: description,
        difficulty: value,
        calories_burn_rate: cbr,
        exercise_type: type,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " +token
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data)
            let errorMessage = 'Enter correct data!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data)
        navigate('/gymshare/exercises', {replace: true})
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }} alt="logo" src={icon}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New Exercise
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} fullWidth>
          <FormControl fullWidth>
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              label="Title"
              type="text"
              id="title"
              name='title'
              autoComplete='off'
            />
            <Grid item xs={12} marginTop={2} marginBottom={3}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  fullWidth
                  name="description"
                  label="Description"
                  type="text"
                  id="description"
                  autoComplete="off"
                  multiline
                  rows={3}
                />
              </Grid>
              
            
          <FormControl>
          <Grid item xs={12}>
        <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={type}
          onChange={handleVisibilityChange}
          fullWidth
          label="Visibility"
        >
          <MenuItem value="With own body weight">With own body</MenuItem>
          <MenuItem value="With a weight">With a weight</MenuItem>
          <MenuItem value="With time">With time</MenuItem>
        </Select>
    </Grid>
    </FormControl>

    <Typography id="input-slider" gutterBottom marginTop={2}>
        Difficulty
      </Typography>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 10,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      <Typography id="input-slider" gutterBottom marginTop={2}>
        Calories Burn Rate
      </Typography>
      <FormControl fullWidth>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof cbr === 'number' ? (cbr*100) : 1}
            onChange={handleCbrChange}
            aria-labelledby="input-slider"
            min={1}
            max={500}
          />
        </Grid>
        <Grid item>
          <Input
            value={cbr}
            size="small"
            onChange={handleInputCbrChange}
            onBlur={handleBlur2}
            inputProps={{
              step: 0.01,
              min: 1,
              max: 5,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      </FormControl>
      </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Workout
            </Button>
            <Grid container>
              <Grid item>
                <Button component={RouterLink} to='/' variant="body2">
                  {"Back to home site"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}