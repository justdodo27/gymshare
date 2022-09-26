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

// ----------------------------------------------------------------------


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function WorkoutDetail() {
    const ProductImgStyle = styled('img')({
        top: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
      });

    let workoutId = useSelector(state => state.workout.workoutId);
    const [workout, setWorkouts] = useState([]);
    const [open, setOpen] = useState(false);
    const [exe, setExe] = useState([]);

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
  
    const handleClose = () => {
        setExe([]);
        setOpen(false);
    };

    const fetchWorkout = () => {

    fetch("http://localhost:1337/workouts/plans/" + workoutId, {
    })

      .then(response => {
        return response.json()
      })
      .then(data => {
        setWorkouts(data);
      })
  }

  useEffect(() => {
    try {
      fetchWorkout()
    } catch (error) {
      
    }
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
    } = workout;



  return (
    <Page title="Workout Details">
      <Container>
        <Card sx={{ maxWidth: "90%", minWidth: "90%"}}>
      <CardActionArea>
      <Box sx={{ pt: '50%', position: 'relative' }}>
        {visibility && (
          <Label
            variant="filled"
            color={(visibility === 'Hidden' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {visibility}
          </Label>
        )}
        <ProductImgStyle alt={title} src={icon} />
      </Box>
        </CardActionArea>
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

        <Stack direction="column" alignItems="left" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Rating: {avg_rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Difficulty: {difficulty}
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
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{exe[0]}</DialogTitle>
        <DialogContent>
        <Typography variant="body2" color="text.secondary">
            Calories Burn Rate: {exe[2]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Difficulty: {exe[3]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Exercise Type: {exe[4]} 
          </Typography>

          <DialogContentText margin="1vh" id="alert-dialog-slide-description">
            {exe[1]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
