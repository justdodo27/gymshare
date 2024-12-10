
import * as React from 'react';
import Page from '../components/Page';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, TextField, Box, Grid, Button, Container, Typography } from '@mui/material';
import icon from "../pictures/gymIcon.svg"
import { useState, useEffect } from "react";
import { useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function validateNumber (number) {
  return !isNaN(number);
}

let photo = '';


export default function EditProfile() {

  const userId = useSelector(state => state.auth.userId);
  const navigate = useNavigate();
  let token = useSelector(state => state.auth.token);


  const [heightError, setHeightError] = useState(false)
  const [weightError, setWeightError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [file,setFile]=useState('')
  const [text,setText]=useState('Upload profile photo')
  const [heightGet, setHeight] = useState("")
  const [weightGet, setWeight] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  let weightErrorCheck = false
  let heightErrorCheck = false
  let firstNameErrorCheck = false
  let lastNameErrorCheck = false

  const handleChange=(e)=>{
    const data=e.target.files[0]
     setFile(data)
     photo = data
     setText(data.name)
     console.log(file)
}
  

  const fetchData = () => {
  fetch(global.config.url + "accounts/profiles/" +userId, {
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
    if (heightErrorCheck || weightErrorCheck || firstNameErrorCheck || lastNameErrorCheck) {

      let form_data = new FormData();
      form_data.append("first_name", first_Name);
      form_data.append("last_name", last_Name);
      form_data.append("height", height);
      form_data.append("weight", weight);
      form_data.append('_method', 'PATCH');
      if(photo!=''){
        form_data.append("profile_picture", photo, photo.name);
      }

      axios
    .patch(global.config.url +  "accounts/profiles/" + userId +"/", form_data, {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': "Bearer " +token
                },
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
          <Avatar sx={{ m: 1, bgcolor: 'background.main', width: 200, height: 100  }} variant="rounded" alt="logo" src={icon}>
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
            <div>
             <input style={{ display: 'none', }} id="icon-button-photo" type="file" onChange={handleChange}/>          
        </div>
                <Grid container spacing={0} justifyContent="center">
      <Grid item>
      <label htmlFor="icon-button-photo">
                    <IconButton color="primary" component="span">
                        <PhotoCamera fontSize='30'/>
                    </IconButton>
                </label>
        </Grid>
        <Grid item>
        <Typography id="text" variant='caption'>
        {text}
      </Typography>
        </Grid>
      </Grid>
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