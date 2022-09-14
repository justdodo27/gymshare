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
import { useHistory} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import {
  ListSubheader,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo } from 'react';
import { useCallback } from 'react';
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

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function SearchWorkout() {

  
  const [array, setArray] = React.useState([''])
  const [difficulty, setDifficulty] = React.useState('')
  const [user, setUser] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [expanded, setExpanded] = React.useState(false);
  let workoutId = useSelector(state => state.workout.workoutId);
  console.log(workoutId)
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;


  const [selectedOption, setSelectedOption] = useState(array[0]);
  console.log(selectedOption + '--Selected')

  const [searchText, setSearchText] = useState("zzzzzzz");
  console.log(searchText)
  const displayedOptions = useMemo(
    () => array.filter((option) => containsText(option, searchText)),
    [searchText, array]
  );


  const fetchMoviesHandler = useCallback(async () => {
    console.log("xd")
    try {
      const response = await fetch("http://localhost:1337/workouts/plans/?search=" + searchText);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      console.log("jest")
      const temp = data.results
      console.log(temp)
      const arrayInput = temp.map(temp=> temp.title);
      console.log(arrayInput)
      
      console.log(data)
      setArray(arrayInput)
      

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, [searchText]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const test = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:1337/workouts/plans/?search=" + selectedOption);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const temp = data.results
      const title = temp[0].title
      const user = temp[0].author.username
      const difficulty = temp[0].difficulty
      setTitle(title)
      setUser(user)
      setDifficulty(difficulty)

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, [selectedOption]);

  useEffect(() => {
    test();
  }, [test]);


  let token = useSelector(state => state.auth.token);
  console.log(token)

  

  return (
    <Fragment>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }} fullWidth>
          <Grid item marginTop={2} alignItems="center">
      <FormControl sx={{ minWidth: 400 }} fullWidth>
        <InputLabel id="search-select-label">Workouts</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          value={selectedOption}
          label="Workouts"
          onChange={(e) => setSelectedOption(e.target.value)}
          // This prevents rendering empty string in Select's value
          // if search text would exclude currently selected option.
          renderValue={() => selectedOption}
        >
          {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={(e) => {e.target.value!=='' && setSearchText(e.target.value)}}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
          {array.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item marginTop={5} alignItems="center">
    </Grid>
    {selectedOption.length>1 && <Card sx={{ minWidth: 400 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={icon}
          alt="sample img"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography gutterBottom variant="h7" component="div">
            @{user}
          </Typography>
          <p>Rating: do zrobienia</p>
          <p>Difficulty: {difficulty}</p>
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
            {"description"}
          </Typography>
        </CardContent>
        </Collapse>
    </Card>}
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </Fragment>
  );
}