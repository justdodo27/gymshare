import { useState, useEffect, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Button, Box, Stack, Typography, Card, CardContent, CardActionArea, 
        List, ListItem, ListItemButton, Grid,
        DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
// components
import Page from '../components/Page';
import Label from '../components/Label';
// mock
import { useSelector} from 'react-redux';
import icon from "../pictures/play.png"
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { workoutActions } from '../store/workout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// ----------------------------------------------------------------------
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });

export default function WorkoutDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);

  
    const ProductImgStyle = styled('img')({
        top: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
      });

    const workoutId = useSelector(state => state.workout.workoutId);
    const [workout, setWorkouts] = useState([]);
    const [open, setOpen] = useState(false);
    const [exe, setExe] = useState([]);
    const [addAlert, setAddAlert] = useState(false);
    const [styleAlert, setStyleAlert] = useState(false);
    const [saved, setSaved] = useState(false);
    

    const handleClickOpen = (title, description, cbr, difficulty, type) => {
        let array = []
        array.push(title)
        array.push(description)
        array.push(cbr)
        array.push(difficulty)
        array.push(type)
        setExe(array);
        setOpen(true);
    };

  const handleClickDelete = () => {

  };
  
    const handleClose = () => {
        setExe([]);
        setOpen(false);
    };

    const fetchWorkout = () => {

    fetch("http://localhost:1337/workouts/plans/" + workoutId, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " +token
      },
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        setWorkouts(data);
        setSaved(data.is_favorite);
      })
  }

  useEffect(() => {
    try {
      fetchWorkout()
    } catch (error) {}
  }, [])
  const { 
    author, 
    avg_rating, 
    avg_time, 
    cycles,
    description,
    difficulty,
    exercises,
    id,
    is_favorite,
    sum_of_cb,
    title,
    visibility 
    } = workout

    const handleClickSave = () => {
      if(saved)
      {
      
        setSaved(false);
        handleClickAlert(false);

      }
      else{
        fetch('http://localhost:1337/workouts/favorites/', {
      method: 'POST',
        body: JSON.stringify({
          workout: workoutId,
          user: userId
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
      })
      .catch((err) => {
        alert(err.message);
      });
        setSaved(true);
        handleClickAlert(true);
      }
    };

    const handleClickAlert = (variant) => {
      if(variant){
        setStyleAlert(true);
        setAddAlert(true);
        
      }
      else{
        setStyleAlert(false);
        setAddAlert(true);
      }
      
    };
  
    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setAddAlert(false);
    };

    

  return (
    <Page title="Workout Details">
      <Container>
        <Card sx={{ maxWidth: "90%", minWidth: "90%"}}>
      <Box sx={{ pt: '1%', position: 'relative' }}>
        {visibility && (
          <Label
            variant="filled"
            color={(visibility === 'Hidden' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: '100%',
              right: '5%',
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {visibility}
          </Label>
        )}
        
      </Box>
        <CardContent sx={{minHeigth:500}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="column" alignItems="left" justifyContent="space-between" mb={1}>
        <Typography gutterBottom variant="h3" component="div">
          {title}
          </Typography>
          {author && <Typography variant="subtitle1" gutterBottom>
            @{author.username}
          </Typography>}
          <Typography variant="body2" color="text.secondary">
            Calories Burn: {sum_of_cb}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {avg_time}
          </Typography>
        </Stack>

        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
          {author && userId && <Box>
            <IconButton 
              aria-label="favoriteicon" 
              size="large" 
              color={(saved === true && 'warning') || 'secondary'} 
              onClick={() => handleClickSave()}>
        <FavoriteIcon fontSize="inherit" />
      </IconButton>
          {author.id === userId && <IconButton aria-label="delete" size="large" color="secondary" onClick={() => handleClickDelete()}>
        <DeleteIcon  fontSize="inherit" />
      </IconButton>}

      </Box>}
      <Rating name="read-only" value={parseFloat(avg_rating)} precision={0.5} readOnly />
        <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body3"
              sx={{
                color: 'text.disabled',
              }}
            >
              Rating
            </Typography>
          </Typography>
          <StyledRating
       
       value={parseFloat(difficulty)/2}
       readOnly
       precision={0.5}
       icon={<FavoriteIcon fontSize="inherit" />}
       emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
     />
      <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body3"
              sx={{
                color: 'text.disabled',
              }}
            >
              Difficulty
            </Typography>
          </Typography>
        </Stack>
        </Stack>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Typography align="center" variant="body2" color="subtitle3">
            Workout cycles: {cycles}
          </Typography>
        {exercises && <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      aria-label="exercises"
    >
    <Grid container spacing={1}>
      {exercises.map((exercise) => (
        <Grid key={exercise.id} item sm={1} md={12}>
        <ListItem disablePadding>
        <ListItemButton onClick={() => {
          handleClickOpen(
            exercise.exercise.title, exercise.exercise.description, exercise.exercise.calories_burn_rate, 
            exercise.exercise.difficulty, exercise.exercise.exercise_type
      )}}
        >
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '90%'}}>
                {exercise.time && <Typography gutterBottom variant="h5">
                {exercise.order}. {exercise.exercise.title} ({exercise.time} s)
                </Typography>}
                {exercise.repeats && <Typography gutterBottom variant="h5">
                {exercise.order}. {exercise.exercise.title} (x{exercise.repeats})
                </Typography>}
                <Typography gutterBottom variant="h5">
                {exercise.series} series
                </Typography>
            </Stack>
        </ListItemButton>
      </ListItem>  
        </Grid>
      ))}
    </Grid>
    </List>}
    </Card>
      </Container>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        
      >
        <DialogTitle>        
        <Box sx={{ pt: '90%', position: 'relative' }}>
        <ProductImgStyle alt={title} src={icon} />
      </Box>
          {exe[0]}
        </DialogTitle>
        <DialogContent>
        <Typography variant="body2" color="text.secondary">
            {exe[4]} 
          </Typography>
        <Typography variant="body2" color="text.secondary">
            Calories Burn Rate: {exe[2]}
          </Typography>
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body3"
              sx={{
                color: 'text.disabled',
              }}
            >
              Difficulty
            </Typography>
          </Typography>
        <StyledRating
       
        value={parseFloat(exe[3])/2}
        readOnly
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
          <DialogContentText margin="1vh" id="alert-dialog-slide-description">
            {exe[1]}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal:'center' }} open={addAlert} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={(styleAlert === true && 'success') || 'info'} sx={{ width: '100%' }}>
          {styleAlert && <Typography>Workout Saved</Typography>}
          {!styleAlert && <Typography>Workout Unsaved</Typography>}
        </Alert>
      </Snackbar>

    </Page>
  );
}
