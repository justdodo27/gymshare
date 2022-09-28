
import * as React from 'react';
import { Avatar, TextField, Box, Grid, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import icon from "../pictures/icon.jpg"
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';

function validatePassword (password) {
  const regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
  return regexp.test(password);
}

export default function ChangePassword() {
    const theme = useTheme();

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false)
  let passwordErrorCheck = false
  let token = useSelector(state => state.auth.token);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')
    const newPassword = data.get('newpassword')
    const repeatPassword = data.get('repeatpassword')

    if (validatePassword(newPassword)) {
      setPasswordError(false)
      passwordErrorCheck = true
    } else {
      setPasswordError(true)
    }

    if (passwordErrorCheck === true) {
    fetch("http://localhost:1337/accounts/change-password/", {
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
        alert(err.message);
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
            <TextField
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
            />
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
              label="repeat password"
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