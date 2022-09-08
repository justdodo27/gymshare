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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import mario from "../pictures/mario.jpg"

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
  const username = useSelector(state => state.auth.username);
  let token = useSelector(state => state.auth.token)

  const [height, setHeight] = useState(null)
  const [weight, setWeight] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [alignment, setAlignment] = React.useState('your');
  const [expanded, setExpanded] = React.useState(false);
  const [workouts, setWorkouts] = React.useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

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
        console.log(data)
        setHeight(data.height)
        setWeight(data.weight)
        setFirstName(data.user.first_name)
        setLastName(data.user.last_name)
        
      })
  }

  const fetchWorkout = () => {

    fetch("http://localhost:1337/workouts/plans/?search="+username, {
      headers: {
        Authorization: "Bearer " +token
      },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        const myWorkouts = []
        console.log(data.results.length)
        for (let i = 0; i < data.results.length; i++){
          if(data.results[i].author.id == userId){
            myWorkouts.push(data.results[i])
          }
        }
        setWorkouts(myWorkouts);
      })
  }

  useEffect(() => {
    fetchData()
    fetchWorkout()
  }, [])
  
  return (
    <Fragment>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Header title="Gymshare" sections={sections} />
        <Typography component="h1" variant="h2" color="inherit" align="center" noWrap sx={{ flex: 1 }}>
          @{username}
        </Typography>
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
          <Typography>First Name</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {firstName}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Last Name</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {lastName}
          </Typography>
        </AccordionDetails>
      </Accordion>
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

    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange1}
      aria-label="Platform"
      size='large'
    >
      <ToggleButton size='medium' value="your">Your Workouts</ToggleButton>
      <ToggleButton size='medium' value="liked">Liked Workouts</ToggleButton>
    </ToggleButtonGroup>
    {alignment==='your' && <Grid container spacing={0}>

    {workouts.map((workout) => (<Grid item sx={2}>
    <Card sx={{ minWidth: 575 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="450"
          image={icon}
          alt="sample img"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {workout.title}
          </Typography>
          <Typography gutterBottom variant="h7" component="div">
            @{workout.author.username}
          </Typography>
          <p>Rating: 2.1</p>
          <p>Difficulty: {workout.difficulty}</p>
        </CardContent>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography variant="body2" color="text.secondary">
            {workout.description}
          </Typography>
        </CardContent>
        </Collapse>
    </Card>
    </Grid>))}
    </Grid>}

    {alignment==='liked' && <Grid container spacing={0}>
    <Grid item sx={2}>
    <Card sx={{ minWidth: 575, maxWidth: 575 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="450"
          image={mario}
          alt="mario pudzian"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Example Workout (Raw in code)
          </Typography>
          <Typography gutterBottom variant="h7" component="div">
            @PolskaGUROM200
          </Typography>
          <p>Rating: 2.1</p>
          <p>Difficulty: 3.7</p>
        </CardContent>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography variant="body2" color="text.secondary">
        Na morza dnie na morza dnie, tam gdzie jest sucho może być krucho. Posłuchaj mnie
        na morza dnie oni na górze uwierz mi w słońcu charują całe dni my tylko jemy i dryfujemy a gdzie? Na morza dnie.
          </Typography>
        </CardContent>
        </Collapse>
    </Card>
    </Grid>
    </Grid>}
    </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
    </Fragment>
  );
}