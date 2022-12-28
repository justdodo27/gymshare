import * as React from 'react';
import { Avatar, TextField, Box, Grid, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
import { workoutActions } from '../store/workout';
import { authActions } from '../store/auth';
import { useEffect } from 'react';
import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const Input = styled(MuiInput)`
  width: 42px;
`;

let photo = '';

export default function AddWorkout() {
  const navigate= useNavigate();
  const [file,setFile]=useState('')
  const [text,setText]=useState('Upload your image')
  const [value, setValue] = React.useState(1);
  const [visibility, setVisibility] = React.useState('Public');
  const dispatch = useDispatch();

  
  let exp = useSelector(state => state.auth.exp);
  
  const handleChange=(e)=>{
    const data=e.target.files[0]
     setFile(data)
     photo = data
     setText(data.name)
     console.log(file)
}

  useEffect(() => {
    if (exp<parseInt(Date.now()/1000)) {
      dispatch(authActions.logout())
      navigate('/', {replace: true});
    }
  }, [dispatch, exp, navigate]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };


  const handleBlur = () => {
    if (value < 1) {
      setValue(1);
    } else if (value > 10) {
      setValue(10);
    }
    else if (((value*10) % 10) !== 0){
        setValue(1)
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title')
    const description = data.get('description')
    console.log(photo)



    dispatch(workoutActions.getWorkoutStats([title, description, visibility, value, photo]))
    navigate('/gymshare/addExerciseToWork', { replace: true });
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }} alt="logo" src={icon}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New Workout
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} fullWidth>
          <FormControl fullWidth>
            <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: '#fff' }} }
              margin="normal"
              required
              fullWidth
              label="Title"
              type="text"
              id="title"
              name='title'
              autoComplete='off'
            />
            <Typography id="logo" gutterBottom marginTop={1}>
      </Typography>
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
            <Grid item xs={12} marginTop={2} marginBottom={3}>
                <TextField
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: '#fff' }}}
                  fullWidth
                  name="description"
                  label="Description"
                  type="text"
                  id="description"
                  autoComplete="off"
                  multiline
                  rows={3}
                />
              </Grid>
              
            
          <FormControl>
          <Grid item xs={12} marginBottom={3}>
        <InputLabel id="demo-simple-select-autowidth-label">Visibility</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={visibility}
          onChange={handleVisibilityChange}
          fullWidth
          label="Visibility"
        >
          <MenuItem value="Public">Public</MenuItem>
          <MenuItem value="Hidden">Hidden</MenuItem>
        </Select>
    </Grid>
    </FormControl>
    <Typography id="input-slider" gutterBottom marginTop={2}>
        Cycles
      </Typography>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
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
      </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Workout
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