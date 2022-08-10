import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fragment } from 'react';
import { blueGrey, indigo } from '@mui/material/colors';
import icon from '../pictures/icon.jpg'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from "../components/header.js"
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

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

const sections = [
  { title: 'Profile', url: '/profile' },
  { title: 'Logout', url: '/logout' },
];

export default function Profile() {

  const userId = useSelector(state => state.auth.userId);

  const [height, setHeight] = useState(null)
  const [weight, setWeight] = useState(null)


  const fetchData = () => {

    fetch("http://localhost:1337/accounts/profiles/" +userId)

      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        setHeight(data.height)
        setWeight(data.weight)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Fragment>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Header title="Gymshare" sections={sections} />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: "primary.main",
          }}
        >
          <div marginbottom="25">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Height</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Your current height: {height}cm
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Weight</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Your current weight: {weight}kg
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Statistics</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
        You burned 800 calories today. Click to  see your statistics.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    <p></p>
    <Grid container justifyContent="flex-start" marginLeft={50}>
              <Grid item>
                <Link component={RouterLink} to='/change' variant="body2">
                Change password
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" marginLeft={50}>
              <Grid item>
                <Link component={RouterLink} to='/edit' variant="body2">
                  Edit profile
                </Link>
              </Grid>
            </Grid>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
    </Fragment>
  );
}