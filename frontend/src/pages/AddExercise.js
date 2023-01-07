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
import axios from 'axios';
import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {forwardRef} from 'react';
import CircularIndeterminate from 'src/components/LoadingSpinner';

const Input = styled(MuiInput)`
  width: 42px;
`;

let photo = '';
let videoNew = '';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

export default function AddExercise() {

  const navigate= useNavigate();
  const [styleAlert, setStyleAlert] = useState(false);
  const [addAlert, setAddAlert] = useState(false);
  const [value, setValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cbr, setCbr] = useState(0);
  const [file,setFile]=useState('')
  const [video,setVideo]=useState('')
  const [text,setText]=useState('Upload exercise logo')
  const [videoText,setVideoText]=useState('Upload video')
  const [type, setType] = useState('With own body weight');
  let token = useSelector(state => state.auth.token);

  const handleCloseAlert = (event, reason) => {
    if(styleAlert){
      navigate('/gymshare/app', { replace: true });
    }
    if (reason === 'clickaway') {
      return;
    }

    setAddAlert(false);
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    
  };
  const handleCbrChange = (event, newValue) => {
    setCbr(newValue/100);
    console.log(typeof cbr)
  };

  const handleChange=(e)=>{
    const data=e.target.files[0]
     setFile(data)
     photo = data
     setText(data.name)
     console.log(file)
     console.log(video)
}

const handleVideo=(e)=>{
  const data=e.target.files[0]
   setVideo(data)
   videoNew = data
   setVideoText(data.name)
}

  const handleVisibilityChange = (event) => {
    setType(event.target.value);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };
  const handleInputCbrChange = (event) => {
    setCbr(event.target.value === '' ? '' : Number(event.target.value));
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
  const handleBlur2 = () => {
    if (cbr < 1) {
      setCbr(0.01);
    } else if (cbr > 5) {
      setCbr(5);
    }
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get('title')
    const description = data.get('description')

    console.log(title)
    console.log(description)
    console.log(type)
    console.log(value)
    console.log(cbr)
    let form_data = new FormData();
      form_data.append("title", title);
      form_data.append("description", description);
      form_data.append("exercise_type", type);
      form_data.append("calories_burn_rate", cbr);
      form_data.append("difficulty", value);
      if(photo!=''){
        form_data.append("thumbnail", photo, photo.name);
      }
      if(videoNew!=''){
        form_data.append("video", videoNew, videoNew.name);
      }
    axios
    .post(global.config.url +  "workouts/exercises/", form_data, {
                method: 'POST',
                headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': "Bearer " +token
                },
            })
      
      .then((data) => {
        console.log(data)
        setIsLoading(false) 
        navigate('/gymshare/exercises', {replace: true})
      })
      .catch((err) => {
        setAddAlert(true);
      });
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
            Add New Exercise
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
            <Grid item xs={12} marginTop={2} marginBottom={2}>
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
              
              <Typography id="logo" gutterBottom>
      </Typography>
    <div>
             <input style={{ display: 'none', }} id="icon-button-video" type="file" onChange={handleVideo}/>          
        </div>
                <Grid container spacing={0} justifyContent="center">
      <Grid item>
      <label htmlFor="icon-button-video">
                    <IconButton color="primary" component="span">
                        <PhotoCamera fontSize='30'/>
                    </IconButton>
                </label>
        </Grid>
        <Grid item>
        <Typography id="text" variant='caption'>
        {videoText}
      </Typography>
        </Grid>
      </Grid>
      <Typography id="logo" gutterBottom>
      </Typography>
          <FormControl>
          <Grid  item xs={12}>
        <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={type}
          onChange={handleVisibilityChange}
          fullWidth
          label="Visibility"
        >
          <MenuItem value="With own body weight">With own body</MenuItem>
          <MenuItem value="With a weight">With a weight</MenuItem>
          <MenuItem value="With time">With time</MenuItem>
        </Select>
    </Grid>
    </FormControl>

    <Typography id="input-slider" gutterBottom marginTop={2}>
        Difficulty
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
      <Typography id="input-slider" gutterBottom marginTop={2}>
        Calories Burn Rate
      </Typography>
      <FormControl fullWidth>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs>
          <Slider
            value={typeof cbr === 'number' ? (cbr*100) : 1}
            onChange={handleCbrChange}
            aria-labelledby="input-slider"
            min={1}
            max={500}
          />
        </Grid>
        <Grid item>
          <Input
            value={cbr}
            size="small"
            onChange={handleInputCbrChange}
            onBlur={handleBlur2}
            inputProps={{
              step: 0.01,
              min: 1,
              max: 5,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      </FormControl>
      </FormControl>
      {isLoading ? <CircularIndeterminate /> : <p></p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              Add Exercise
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
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal:'center' }} open={addAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={(styleAlert === true && 'success') || 'error'} sx={{ width: '100%' }}>
          <Typography>Error! Empty or wrong data.</Typography>
        </Alert>
      </Snackbar>
      </Container>
  );
}