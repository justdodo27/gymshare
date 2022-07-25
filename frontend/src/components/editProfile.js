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

export default function ChangePassword() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
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
            Edit Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
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
            />
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="height"
              label="Height"
              type="height"
              id="height"
              autoComplete="height"
              defaultValue="182cm"
            />
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="weight"
              label="Weight"
              type="weight"
              id="weight"
              autoComplete="weight"
              defaultValue="75kg"
            />
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