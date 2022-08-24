import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fragment } from 'react';
import { blueGrey, indigo } from '@mui/material/colors';
import icon from "../pictures/icon.jpg"
import { useHistory} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link component={RouterLink} to='/' color="inherit">
        Gymshare
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: blueGrey[800],
    },
    primary: {
      main: indigo[50],
    },
    secondary: {
      main: indigo[50],
    }
  },
}
);


const Input = styled(MuiInput)`
  width: 42px;
`;

export default function AddExercise() {

  const history = useHistory();
  const [passwordError, setPasswordError] = useState(false)
  const [value, setValue] = React.useState(5);
  const [calories, setCalories] = React.useState(100);
  const [type, setType] = React.useState('');
  let passwordErrorCheck = false
  let token = useSelector(state => state.auth.token);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCaloriesSliderChange = (event, newValue) => {
    setCalories(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleCaloriesInputChange = (event) => {
    setCalories(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const handleCaloriesBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 500) {
      setValue(500);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title')
    console.log(title)
    const description = data.get('description')
    console.log(description)
    console.log(type)
    console.log(value)
    console.log(calories)

    fetch("http://localhost:1337/workouts/exercises/", {
      method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          difficulty: value,
          calories_burn_rate: calories,
          exercise_type: type
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
            let errorMessage = 'Wrong username or password!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data)
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Fragment>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
            <Grid item xs={12}>
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
              min: 0,
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
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof calories === 'number' ? calories : 0}
            onChange={handleCaloriesSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={500}
          />
        </Grid>
        <Grid item marginBottom={3}>
          <Input
            value={calories}
            size="small"
            onChange={handleCaloriesInputChange}
            onBlur={handleCaloriesBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 500,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
        <div>
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Exercise Type</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={type}
          onChange={handleTypeChange}
          fullWidth
          label="Exercise Type"
        >
          <MenuItem value="With own body weight">With own body weight</MenuItem>
          <MenuItem value="With a weight">With a weight</MenuItem>
          <MenuItem value="With time">With time</MenuItem>
        </Select>
      </FormControl>
    </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Exercise
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to='/' variant="body2">
                  {"Back to main Page"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </Fragment>
  );
}