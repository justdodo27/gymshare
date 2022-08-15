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
import { useState } from 'react';
import { useSelector} from 'react-redux';
import { useHistory} from 'react-router-dom';
import { useEffect } from 'react';

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
  const userId = useSelector(state => state.auth.userId);
  const history = useHistory();
  let token = useSelector(state => state.auth.token);


  const [heightError, setHeightError] = useState(false)
  const [weightError, setWeightError] = useState(false)
  const [heightGet, setHeight] = useState("")
  const [weightGet, setWeight] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  let weightErrorCheck = false
  let heightErrorCheck = false
  

  console.log(token)

  const fetchData = () => {
  fetch("http://localhost:1337/accounts/profiles/" +userId, {
      headers: {
        Authorization: "Bearer " +token
      },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        setHeight(data.height)
        setWeight(data.weight)
        setFirstName(data.user.first_name)
        setLastName(data.user.last_name)
        
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let height = data.get('height')
    let weight = data.get('weight')
    let first_Name = data.get('first_name')
    let last_Name = data.get('last_name')

    console.log(first_Name)
    console.log(last_Name)
  

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
    

    if (heightErrorCheck === true && weightErrorCheck === true) {
      fetch("http://localhost:1337/accounts/profiles/" + userId +"/", {
        method: 'PUT',
        body: JSON.stringify({
          first_name: first_Name,
          last_name: last_Name,
          height: height,
          weight: weight,
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
              let errorMessage = 'Something gone wrong!';
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          console.log(data)
          history.replace('/profile');
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
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              name="first_name"
              label="First name"
              type="first_name"
              id="first_name"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
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
              value={lastName}
              onChange={event => setLastName(event.target.value)}
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
              value={heightGet}
              onChange={event => setHeight(event.target.value)}
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
              helperText="Please enter valid height"
              autoFocus
              defaultValue={heightGet}
              onChange={event => setHeight(event.target.value)}
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
              value={weightGet}
              onChange={event => setWeight(event.target.value)}
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
              helperText="Please enter valid weight"
              autoFocus
              defaultValue={weightGet}
              onChange={event => setWeight(event.target.value)}
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
                <Link component={RouterLink} to='/Profile' variant="body2">
                  {"Back to Profile"}
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