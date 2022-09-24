import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import icon from "../pictures/icon.jpg"
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  ListSubheader,
  InputAdornment
} from "@mui/material";
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';


const Input = styled(MuiInput)`
  width: 42px;
`;

export default function AddExerciseToWork() {

  const navigate = useNavigate();
  const [repeats, setRepeats] = React.useState(5);
  const [series, setSeries] = React.useState(5);
  const [time, setTime] = React.useState(30);
  const [alignment, setAlignment] = React.useState('series');
  const [array, setArray] = React.useState([''])
  const [indexes, setIndexes] = React.useState([''])
  const [description, setDescription] = React.useState([''])
  const [order, setOrder] = React.useState(0)
  let workoutId = useSelector(state => state.workout.workoutId);
  console.log(workoutId)


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

  console.log(searchText)

  const fetchMoviesHandler = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:1337/workouts/exercises/?search=" + searchText);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const arrayInput = data.map(data => data.title);
      const arrayIndex = data.map(data => data.id);
      console.log(arrayInput)
      console.log(data)
      setArray(arrayInput)
      setIndexes(arrayIndex)
      

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
      const response = await fetch("http://localhost:1337/workouts/exercises/?search=" + selectedOption);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const descriptions = data.map(data => data.description)
      setDescription(descriptions[0])

    } catch (error) {
      return<p>Error</p>;
    }
    ;
  }, [selectedOption]);

  useEffect(() => {
    test();
  }, [test]);

  const temp = array.indexOf(selectedOption)
    const index = indexes[temp]
    console.log(index + "--INDEX")

  const descriptionData= description[temp]
    console.log(descriptionData + "--DESCR")

  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  let token = useSelector(state => state.auth.token);
  console.log(token)

  const handleSliderChange = (event, newValue) => {
    setRepeats(newValue);
  };

  const handleCaloriesSliderChange = (event, newValue) => {
    setSeries(newValue);
  };

  const handleTimeSliderChange = (event, newValue) => {
    setTime(newValue);
  };

  const handleInputChange = (event) => {
    setRepeats(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleCaloriesInputChange = (event) => {
    setSeries(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleTimeInputChange = (event) => {
    setTime(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (repeats < 0) {
      setRepeats(1);
    } else if (repeats > 10) {
      setRepeats(10);
    }
  };

  const handleTimeBlur = () => {
    if (time < 0) {
      setTime(1);
    } else if (time > 60) {
      setTime(60);
    }
  };

  const handleCaloriesBlur = () => {
    if (series< 0) {
      setRepeats(1);
    } else if (series> 20) {
      setRepeats(20);
    }
  };

  const end = (event) => {
    if(alignment==="series" && selectedOption!==''){
      fetch("http://localhost:1337/workouts/exercises-in-workouts/", {
        method: 'POST',
          body: JSON.stringify({
            order: order,
            repeats: repeats,
            series: series,
            exercise: index,
            workout: workoutId
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
          setOrder(order+1)
          setDescription('')
          setSelectedOption('')
          setSeries(1)
          setRepeats(1)
          setTime(1)
        })
        .catch((err) => {
          alert(err.message);
        });
    }

    if(alignment==="time" && selectedOption!==''){
      fetch("http://localhost:1337/workouts/exercises-in-workouts/", {
        method: 'POST',
          body: JSON.stringify({
            order: order,
            repeats: repeats,
            time: time,
            exercise: index,
            workout: workoutId
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
          setOrder(order+1)
          setDescription('')
          setSelectedOption('')
          setSeries(1)
          setRepeats(1)
          setTime(1)
        })
        .catch((err) => {
          alert(err.message);
        });
    }

    navigate('/gymshare/app', { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if(alignment==="series" && selectedOption!==''){
    fetch("http://localhost:1337/workouts/exercises-in-workouts/", {
      method: 'POST',
        body: JSON.stringify({
          order: order,
          repeats: repeats,
          series: series,
          exercise: index,
          workout: workoutId
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
        setOrder(order+1)
        setDescription('')
        setSelectedOption('')
        setSeries(1)
        setRepeats(1)
        setTime(1)
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  if(alignment==="time" && selectedOption!==''){
    fetch("http://localhost:1337/workouts/exercises-in-workouts/", {
      method: 'POST',
        body: JSON.stringify({
          order: order,
          repeats: repeats,
          time: time,
          exercise: index,
          workout: workoutId
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
        setOrder(order+1)
        setDescription('')
        setSelectedOption('')
        setSeries(1)
        setRepeats(1)
        setTime(1)
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
            Add New Exercise
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} fullWidth>
          <div>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          value={selectedOption}
          label="Options"
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
    </div>
    <p>{selectedOption.length>1 && description}</p>
    <Grid item marginTop={2} alignItems="center">
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      fullWidth
      onChange={handleChange1}
      size='large'
    >
      <ToggleButton size='medium' value="series">On Series</ToggleButton>
      <ToggleButton size='medium' value="time">On Time</ToggleButton>
    </ToggleButtonGroup>
    </Grid>
      <Typography id="input-slider" gutterBottom marginTop={2}>
        Repeats
      </Typography>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof repeats === 'number' ? repeats : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </Grid>
        <Grid item>
          <Input
            value={repeats}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 10,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      {alignment==='series' && <Typography id="input-slider" gutterBottom marginTop={2}>
        Series
      </Typography>}
      {alignment==='series' && <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof series === 'number' ? series : 0}
            onChange={handleCaloriesSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </Grid>
        <Grid item marginBottom={3}>
          <Input
            value={series}
            size="small"
            onChange={handleCaloriesInputChange}
            onBlur={handleCaloriesBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 20,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>}
      {alignment==='time' && <Typography id="input-slider" gutterBottom marginTop={2}>
        Time
      </Typography>}
      {alignment==='time' && <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof time === 'number' ? time : 0}
            onChange={handleTimeSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={60}
          />
        </Grid>
        <Grid item marginBottom={3}>
          <Input
            value={time}
            size="small"
            onChange={handleTimeInputChange}
            onBlur={handleTimeBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 60,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add next Exercise
            </Button>
            <Button
              onClick={end}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create your workout
            </Button>
            <Grid container>
              <Grid item>
                <Button component={RouterLink} to='/' variant="body2">
                  {"Back to main Page"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}