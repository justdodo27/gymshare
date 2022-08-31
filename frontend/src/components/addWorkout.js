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

export default function AddWorkout() {

  const history = useHistory();
  const [passwordError, setPasswordError] = useState(false)
  const [value, setValue] = React.useState(1);
  const [visibility, setVisibility] = React.useState('Public');
  let passwordErrorCheck = false
  let token = useSelector(state => state.auth.token);
  let author = useSelector(state => state.auth.userId);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title')
    const description = data.get('description')

    console.log(title)
    console.log(description)
    console.log(visibility)
    console.log(value)
    console.log(author)

    fetch("http://localhost:1337/workouts/plans/", {
      method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          sum_of_cb: 0,
          difficulty: 0,
          visibility: visibility,
          avg_time: 0,
          cycles: value,
          author: author
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
            Add New Workout
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
              
      
        <div>
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Visibility</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={visibility}
          onChange={handleVisibilityChange}
          fullWidth
          label="Visibility"
        >
          <MenuItem value="Public">Public</MenuItem>
          <MenuItem value="Hidden">Hidden</MenuItem>
        </Select>
      </FormControl>
    </div>

    <Typography id="input-slider" gutterBottom marginTop={2}>
        Cycles
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