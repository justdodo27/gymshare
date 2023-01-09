
import * as React from 'react';
import { Avatar, TextField, Box, Grid, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import icon from "../pictures/icon.jpg"
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';

function validatePassword (password) {
  const regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
  return regexp.test(password);
}

export default function ChangePassword() {

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false)
  const [oldPasswordError, setOldPasswordError] = useState(false)
  const [repPasswordError, setRepPasswordError] = useState(false)
  let passwordErrorCheck = false
  let token = useSelector(state => state.auth.token);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')
    const newPassword = data.get('newpassword')
    const repeatPassword = data.get('repeatpassword')

    if (validatePassword(newPassword) && newPassword !== password) {
      setPasswordError(false)
      if(newPassword === repeatPassword){
        setRepPasswordError(false)
        passwordErrorCheck = true
      }
      else{
        setRepPasswordError(true)
      }
    } else {
      setPasswordError(true)
    }

    if (passwordErrorCheck === true) {
    fetch(global.config.url + "accounts/change-password/", {
      method: 'PATCH',
        body: JSON.stringify({
          old_password: password,
          new_password: newPassword
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
            setOldPasswordError(true)
            let errorMessage = 'Wrong username or password!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data)
        navigate('/gymshare/Logout', {replace: true})
      })
      .catch((err) => {

      });
    }
  };

  return (
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
            Change Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {!oldPasswordError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              name="password"
              label="current password"
              type="password"
              id="password"
              autoComplete="current-password"
            />}
            {oldPasswordError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              error
              fullWidth
              name="password"
              label="current password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText="Wrong password"
            />}
            {!passwordError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  required
                  fullWidth
                  name="newpassword"
                  label="new password"
                  type="password"
                  id="newpassword"
                  autoComplete="new-password"
                />
              </Grid>}
              {passwordError && <Grid item xs={12}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  error
                  fullWidth
                  name="newpassword"
                  label="new password"
                  type="password"
                  id="newpassword"
                  autoComplete="new-password"
                  helperText="Try another stronger password"
                />
              </Grid>}
            {!repPasswordError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              name="repeatpassword"
              label="repeat password"
              type="password"
              id="repeatpassword"
              autoComplete="repeat-new-password"
            />}
            {repPasswordError && <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              error
              fullWidth
              name="repeatpassword"
              label="repeat password"
              type="password"
              id="repeatpassword"
              autoComplete="repeat-new-password"
              helperText="Passwords are not the same"
            />}
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
                <Button component={RouterLink} to='/' variant="body2">
                  {"Back to home site"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}