import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fragment} from 'react';
import { blueGrey, indigo } from '@mui/material/colors';
import icon from '../../../pictures/gymIcon.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {forwardRef} from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link component={RouterLink} to='/' color="inherit">
        Gymshare
      </Link>{' '}
      {new Date().getFullYear()}
      {'. '}
      <Link component={RouterLink} to='/privacy-policy' color="inherit">
        Privacy Policy.
      </Link>{' '}
    </Typography>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

function validateEmail (email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
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

export default function SignUp() {
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [styleAlert, setStyleAlert] = useState(false);
  const [addAlert, setAddAlert] = useState(false);
  const navigate = useNavigate();

  let emailErrorCheck = false
  let passwordErrorCheck = false


  const handleCloseAlert = (event, reason) => {
    if(styleAlert){
      navigate('/gymshare/app', { replace: true });
    }
    if (reason === 'clickaway') {
      return;
    }

    setAddAlert(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
      let email = data.get('email')
      let password = data.get('password')
      let username = data.get('username')
      

      if (validateEmail(email)) {
        setEmailError(false)
        emailErrorCheck = true
      } else {
        setEmailError(true)
      }

      if (validatePassword(password)) {
        setPasswordError(false)
        passwordErrorCheck = true
      } else {
        setPasswordError(true)
      }

    console.log(emailError, setPasswordError)

    if (emailErrorCheck === true && passwordErrorCheck === true) {
      fetch(global.config.url + "accounts/users/", {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,

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
              let errorMessage = 'Username or email are already taken!';
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          setStyleAlert(true);
          setAddAlert(true);
          console.log(data)
        })
        .catch((err) => {
          setAddAlert(true);
          setStyleAlert(false)
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
            color: "primary.main",
          }}
        >
          <Link component={RouterLink} to='/' variant="body2">
          <Avatar sx={{ m: 1, bgcolor: 'background.main', width: 200, height: 100 }} variant="rounded" alt="logo" src={icon}>
          </Avatar>
          </Link>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} >
              
              {!emailError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>}
              {emailError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  error
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText="Please enter valid email"
                />
              </Grid>}
              <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              {!passwordError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  required
                  fullWidth
                  name="password"
                  label="Password"
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
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText="Password should have at least 8 characters, one capital letter, one lowercase letter and one number"
                />
              </Grid>}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to='/login' variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal:'center' }} open={addAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={(styleAlert === true && 'success') || 'error'} sx={{ width: '100%' }}>
          {styleAlert && <Typography>
Registration was successful. Now you can log in.</Typography>}
{!styleAlert && <Typography>Username or email is already taken!</Typography>}
        </Alert>
      </Snackbar>
    </ThemeProvider>
    </Fragment>
  );
}