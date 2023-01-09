import * as React from 'react';
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
import { Fragment } from 'react';
import { blueGrey, indigo} from '@mui/material/colors';
import icon from '../../../pictures/gymIcon.svg'
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../../../store/auth';
import jwt_decode from "jwt-decode";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {forwardRef} from 'react';
import { useState } from 'react';

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

export default function Login() {
  const [styleAlert, setStyleAlert] = useState(false);
  const [addAlert, setAddAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const password = data.get('password')
    const username = data.get('username')
    console.log(password, username);

    fetch(global.config.url+ "api/token/", {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        username: username
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
        console.log(parseInt(Date.now()/1000))
        const decodedData = jwt_decode(data.access)
        const decodedId = decodedData.user_id
        const decodedExpTime = decodedData.exp
        console.log(decodedExpTime)
        console.log(data.access)
        dispatch(authActions.login([data.access, decodedId, username, decodedExpTime, data.is_staff]))
        setStyleAlert(true);
        setAddAlert(true);
      })
      .catch((err) => {
        setAddAlert(true);
        setStyleAlert(false)
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
          <Link component={RouterLink} to='/' variant="body2">
          <Avatar sx={{ m: 1, color:'background.main', bgcolor: 'background.main', width: 200, height: 100  }} variant="rounded" alt="logo" src={icon}>
          </Avatar>
          </Link>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to='/forgot' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to='/register' variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal:'center' }} open={addAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={(styleAlert === true && 'success') || 'error'} sx={{ width: '100%' }}>
{!styleAlert && <Typography>Wrong username or password!</Typography>}
        </Alert>
      </Snackbar>
      </Container>
    </ThemeProvider>
    </Fragment>
  );
}