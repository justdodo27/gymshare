import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fragment } from 'react';
import { blueGrey, indigo } from '@mui/material/colors';
import icon from "../pictures/icon.jpg"
import { useState } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Gymshare
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function validateEmail (email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}

function validateNumber (number) {
  return !isNaN(number);
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

export default function EditProfile() {
  const [emailError, setEmailError] = useState(false)
  const [heightError, setHeightError] = useState(false)
  const [weightError, setWeightError] = useState(false)

  let emailErrorCheck = false
  let weightErrorCheck = false
  let heightErrorCheck = false
  let enteredWeight = ''
  let enteredHeight = ''

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get('email')
    let height = data.get('height')
    let weight = data.get('weight')
    let firstName = data.get('firstName')
    let lastName = data.get('lastName')

    enteredHeight = height
    enteredWeight = weight

    if (validateEmail(email)) {
      setEmailError(false)
      emailErrorCheck = true
    } else {
      setEmailError(true)
      emailErrorCheck = false
    }

    if (validateNumber(weight)) {
      setWeightError(false)
      weightErrorCheck = true
    } else {
      setWeightError(true)
      weightErrorCheck = false
    }

    if (validateNumber(height)) {
      setHeightError(false)
      heightErrorCheck = true
    } else {
      setHeightError(true)
      heightErrorCheck = false
    }

    if (emailErrorCheck === true && heightErrorCheck === true && weightErrorCheck === true) {
      fetch("http://localhost:1337/accounts/profiles/3", {
        method: 'PATCH',
        body: JSON.stringify({
          height: height,
          weight: weight
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = 'Something gone wrong!';
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          alert(err.message);
        });
    };
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
            Edit Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {!emailError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              defaultValue="mikolajsimon.nt@gmail.com"
              autoFocus
            />
            }
            {emailError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              error
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText="Please enter valid email"
              autoFocus
            />
            }
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="first_name"
              label="First name"
              type="first_name"
              id="first_name"
              autoComplete="first_name"
              defaultValue="Mikołaj"
              autoFocus
            />
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="last_name"
              label="Last name"
              type="last_name"
              id="last_name"
              autoComplete="last-name"
              defaultValue="Simon"
              autoFocus
            />
            {!heightError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="height"
              label="Height"
              type="height"
              id="height"
              autoComplete="height"
              defaultValue="182"
              autoFocus
            />
            }
            {heightError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              error
              name="height"
              label="Height"
              type="height"
              id="height"
              autoComplete="height"
              helperText="Please enter valid height"
              autoFocus
              defaultValue={enteredHeight}
            />
            }
            {!weightError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="weight"
              label="Weight"
              type="weight"
              id="weight"
              autoComplete="weight"
              defaultValue="75"
              autoFocus
            />
            }
            {weightError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              error
              name="weight"
              label="Weight"
              type="weight"
              id="weight"
              autoComplete="weight"
              helperText="Please enter valid weight"
              autoFocus
              defaultValue={enteredWeight}
            />
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save changes
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Back to main page"}
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