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
import { blueGrey, indigo} from '@mui/material/colors';
import icon from "../pictures/icon.jpg"
import { useHistory} from 'react-router-dom';
import { useState } from 'react';


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

function validatePassword (password) {
  const regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
  return regexp.test(password);
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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('reset_token')

export default function ConfirmPassword() {

    const history = useHistory();
  const [passwordError, setPasswordError] = useState(false)
  let passwordErrorCheck = false

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')
    console.log(password)
    console.log(token)


    if (validatePassword(password)) {
        setPasswordError(false)
        passwordErrorCheck = true
      } else {
        setPasswordError(true)
      }
    

    

      if (passwordErrorCheck === true) {
    fetch("http://localhost:1337/api/password-reset/confirm/", {
      method: 'POST',
        body: JSON.stringify({
          password: password,
          token: token  
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
}

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
            New Password
          </Typography>
          <p></p>
          <Typography component="h1" variant="body1">
            Please enter your new password. 
From now, you will be able to log in with this password.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {!passwordError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  required
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>}
              {passwordError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  error
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText="Password should be at least 8 characters"
                />
              </Grid>}
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              name="repeatpassword"
              label="Repeat password"
              type="password"
              id="repeatpassword"
              autoComplete="repeat-new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to='/profile' variant="body2">
                  {"Back to profile view"}
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