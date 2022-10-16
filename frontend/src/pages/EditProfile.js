
import * as React from 'react';
import Page from '../components/Page';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, TextField, Box, Grid, Button, Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import icon from "../pictures/icon.jpg"
import { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';

function validateNumber (number) {
  return !isNaN(number);
}


export default function EditProfile() {
    const theme = useTheme();

  const userId = useSelector(state => state.auth.userId);
  const navigate = useNavigate();
  let token = useSelector(state => state.auth.token);


  const [heightError, setHeightError] = useState(false)
  const [weightError, setWeightError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [heightGet, setHeight] = useState("")
  const [weightGet, setWeight] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  let weightErrorCheck = false
  let heightErrorCheck = false
  let firstNameErrorCheck = false
  let lastNameErrorCheck = false

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
  

    if (validateNumber(weight) && weight.length !== 0) {
      setWeightError(false)
      weightErrorCheck = true
    } else {
      setWeightError(true)
      weightErrorCheck = false
    }

    if (validateNumber(height) && height.length !== 0) {
      setHeightError(false)
      heightErrorCheck = true
    } else {
      setHeightError(true)
      heightErrorCheck = false
    }
    if(first_Name.length !== 0){
      setFirstNameError(false)
      firstNameErrorCheck = true
    }else {
      setFirstNameError(true)
      firstNameErrorCheck = false
    }
    if(last_Name.length !== 0){
      setLastNameError(false)
      lastNameErrorCheck = true
    }else {
      setLastNameError(true)
      lastNameErrorCheck = false
    }
    
    console.log(heightErrorCheck, weightErrorCheck, firstNameErrorCheck, lastNameErrorCheck)
    if (heightErrorCheck && weightErrorCheck && firstNameErrorCheck && lastNameErrorCheck) {
      fetch("http://localhost:1337/accounts/profiles/" + userId +"/", {
        method: 'PATCH',
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
              let errorMessage = 'Enter correct data!';
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          console.log(data)
          navigate('/gymshare/profile', {replace: true})
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };


  return (
    <Page title="Edit Profile">
      <Container component="main" maxWidth="xs">
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
            {!firstNameError && <TextField
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
            />}
            {firstNameError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              error
              name="first_name"
              label="First name"
              type="first_name"
              id="first_name"
              value={firstName}
              helperText="Please enter valid height"
              onChange={event => setFirstName(event.target.value)}
              autoFocus
            />}
            {!lastNameError && <TextField
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
              
            />}
            {lastNameError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              fullWidth
              error
              name="last_name"
              label="Last name"
              type="last_name"
              id="last_name"
              helperText="Please enter valid height"
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              autoFocus
            />}
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
              value={heightGet}
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
              value={weightGet}
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
                <Button component={RouterLink} to='/gymshare/Profile' variant="body2">
                  {"Back to Profile"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      </Page>
  );
}