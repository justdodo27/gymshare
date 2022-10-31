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
import {
  ListSubheader,
  InputAdornment
} from "@mui/material";
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';






const Input = styled(MuiInput)`
  width: 42px;
`;

export default function AddExerciseToWork() {

  const navigate = useNavigate();
  const [repeats, setRepeats] = React.useState(5);
  const [type, setType] = React.useState('With a weight');
  const [series, setSeries] = React.useState(5);
  const [time, setTime] = React.useState(30);
  const [alignment, setAlignment] = React.useState('repeats');
  const [array, setArray] = React.useState([''])
  const [indexes, setIndexes] = React.useState([''])
  const [description, setDescription] = React.useState([''])
  const [order, setOrder] = React.useState(1)
  const [table, setTable] = React.useState([])
  const [data, setData] = React.useState([])
  let workoutTitle = useSelector(state => state.workout.title);
  let workoutDescription = useSelector(state => state.workout.description);
  let workoutVisibility = useSelector(state => state.workout.visibility);
  let workoutCycles = useSelector(state => state.workout.cycles);
  console.log(workoutTitle)

  function handleDeleting(index) {
    console.log(table)
    console.log(index)
    setTable(table.filter(item => item.order !== index))
    setData(data.filter(item => item.order !== index))
  };

 

  const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;


  const [selectedOption, setSelectedOption] = useState(array[0]);
  console.log(selectedOption + '--Selected')

  const [searchText, setSearchText] = useState("zzzzzzz");
  const displayedOptions = useMemo(
    () => array.filter((option) => containsText(option, searchText)),
    [searchText, array]
  );


  const fetchMoviesHandler = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:1337/workouts/exercises/?search=" + searchText);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const arrayInput = data.map(data => data.title);
      const arrayIndex = data.map(data => data.id);
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
      const exerciseType = data.map(data => data.exercise_type)

      setType(exerciseType[0])
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
    console.log(index)
   

  const descriptionData= description[temp]

  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  let token = useSelector(state => state.auth.token)

  const handleSliderChange = (event, newValue) => {
    setSeries(newValue);
  };

  const handleCaloriesSliderChange = (event, newValue) => {
    setRepeats(newValue);
  };

  const handleTimeSliderChange = (event, newValue) => {
    setTime(newValue);
  };

  const handleInputChange = (event) => {
    setSeries(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleCaloriesInputChange = (event) => {
    setRepeats(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleTimeInputChange = (event) => {
    setTime(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (series < 0) {
      setSeries(1);
    } else if (series > 20) {
      setSeries(20);
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
    if (repeats< 0) {
      setRepeats(1);
    } else if (repeats> 50) {
      setRepeats(50);
    }
  };

  const end = (event) => {
      fetch("http://localhost:1337/workouts/plans/upload/", {
        method: 'POST',
          body: JSON.stringify({
            workout_to_create: {
              title: workoutTitle,
              description: workoutDescription,
              visibility: workoutVisibility,
              cycles: workoutCycles
            },
            exercises: data,
            
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

    navigate('/gymshare/app', { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if((type==='With own body weight' || type==='With a weight') && selectedOption!==''){

      let exerciseToAdd = {
        "exercise": selectedOption.toString(),
        "order": order,
        "series": series,
        "repeats": repeats
      }

      let dataToAdd = {
        "exercise": index,
        "order": order,
        "series": series,
        "repeats": repeats
      }

    setTable([...table, exerciseToAdd])
    setData([...data, dataToAdd])
        setOrder(order+1)
        setDescription('')
        setSelectedOption('')
        setSeries(1)
        setRepeats(1)
        setTime(1)
     
  }

  if(type==='With time' && selectedOption!==''){

    let exerciseToAdd = {
      "exercise": selectedOption.toString(),
      "order": order,
      "series": series,
      "time": time
    }

    let dataToAdd = {
      "exercise": index,
      "order": order,
      "series": series,
      "repeats": repeats
    }

    setTable([...table, exerciseToAdd])
    setData([...data, dataToAdd])
    
        setOrder(order+1)
        setDescription('')
        setSelectedOption('')
        setSeries(1)
        setRepeats(1)
        setTime(1)
     
  }


};

  return (
      <Container component="main" sx={{
        width: 500,
      }}>
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
            Add Exercise
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, minWidth: '100%' }}>
          <div>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          sx={{
            marginBottom:2
          }}
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
    </Grid>
      <Typography id="input-slider" gutterBottom marginTop={2}>
        Series
      </Typography>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof series === 'number' ? series : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={20}
          />
        </Grid>
        <Grid item>
          <Input
            value={series}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 20,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      {(type==='With own body weight' || type==='With a weight') && <Typography id="input-slider" gutterBottom marginTop={2}>
        Repeats
      </Typography>}
      {(type==='With own body weight' || type==='With a weight') && <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof repeats === 'number' ? repeats : 0}
            onChange={handleCaloriesSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={50}
          />
        </Grid>
        <Grid item marginBottom={3}>
          <Input
            value={repeats}
            size="small"
            onChange={handleCaloriesInputChange}
            onBlur={handleCaloriesBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: 50,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>}
      {type==='With time' && <Typography id="input-slider" gutterBottom marginTop={2}>
        Time
      </Typography>}
      {type==='With time' && <Grid container spacing={2} alignItems="center">
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
              Add Exercise
            </Button>
            <Button
              onClick={end}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Done
            </Button>
          </Box>
        </Box>
      {table.length>0 && <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell>Exercise</TableCell>
            <TableCell align="center">Repeats/Time</TableCell>
            <TableCell align="center">Series</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table.map((row, index) => (
            <TableRow
              key={row.order}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            > 
              <TableCell component="th" scope="row" align="center">{(index+1)+"."}</TableCell>
              <TableCell align="center">
                {row.exercise}
              </TableCell>
              <TableCell align="center">{row.repeats!=null ? row.repeats : row.time}</TableCell>
              <TableCell align="center">{row.series}</TableCell>
              <TableCell align="center"><IconButton edge="end" aria-label="delete">
                      <DeleteIcon onClick={()=>handleDeleting(index)} sx={[
    {
      color: "white"
    },
    {
      '&:hover': {
        color: 'black',
      },
    },
  ]}/>
                    </IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>}
      </Container>
  );
}