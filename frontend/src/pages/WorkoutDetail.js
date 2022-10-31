import { useState, useEffect, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Button, Box, Stack, Typography, Card, CardContent, CardMedia, CardHeader, CardActionArea,
        DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog, Backdrop, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
// components
import Page from '../components/Page';
import Label from '../components/Label';
// mock
import { useSelector} from 'react-redux';
import icon from "../pictures/play.png"
import nophoto from "../pictures/nophoto.jpg"
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import nophotoicon from "../pictures/nophoto.jpg"

// ----------------------------------------------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.primary.dark,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
    
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.primary.light,
  },
}));
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
        opacity: 0.7
      });
      const PlayImgStyle = styled('img')({
        top: '15%',
        left: '15%',
        width: '70%',
        height: '70%',
        objectFit: 'cover',
        position: 'absolute',
        opacity: 0.4,
        "&:hover": {
          cursor: "pointer",
          opacity: 0.6,
        },
      });

    const workoutId = useSelector(state => state.workout.workoutId);
    const [workout, setWorkouts] = useState([]);
    const [open, setOpen] = useState(false);
    const [exe, setExe] = useState([]);
    const [addAlert, setAddAlert] = useState(false);
    const [styleAlert, setStyleAlert] = useState(false);
    const [saved, setSaved] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [Video, setVideo] = useState('');
    
    const handleCloseVideo = () => {
      setVideo('');
      setOpenVideo(false);
    };
    const handleToggleVideo = (src) => {
      setVideo(src);
      setOpenVideo(!openVideo);
    };
    

    const handleClickOpen = (title, description, cbr, difficulty, type, thumbnail, video) => {
        let array = []
        array.push(title)
        array.push(description)
        array.push(cbr)
        array.push(difficulty)
        array.push(type)
        if(thumbnail){
          array.push(thumbnail)
        }else{
          array.push(nophotoicon)
        }
        array.push(video)
        setExe(array);
        setOpen(true);
    };

  const handleClickDelete = () => {
    fetch('http://localhost:1337/workouts/plans/'+workoutId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " +token,
          },
        })
        .then(() => {navigate('/', { replace: true });})
        
  };
  
    const handleClose = () => {
        setExe([]);
        setOpen(false);
    };

    const fetchWorkout = () => {
      let head = ''
      if(token){
        head = "Bearer " +token
      }
    fetch("http://localhost:1337/workouts/plans/" + workoutId, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: head
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
    visibility ,
    thumbnail
    } = workout
    let workoutThumbnail = ''
    if(thumbnail){
      workoutThumbnail = thumbnail
    }else{
      workoutThumbnail = nophoto
    }
    console.log()

    const handleClickSave = () => {
      if(saved)
      {
        fetch('http://localhost:1337/workouts/favorites/0/', {
          method: 'DELETE',
            body: JSON.stringify({
              workout: workoutId
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " +token,
          },
        })
        .then(() => this.setState({ status: 'Delete successful' }));
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
        <Box sx={{ pt: '2', position: 'relative' }}>
        {visibility && (
          <Label
            variant="filled"
            color={(visibility === 'Hidden' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 10,
              right: 10,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {visibility}
          </Label>
        )}
        <IconButton variant="filled" aria-label="backarrow" size="large" color="secondary"             
        sx={{
              zIndex: 9,
              top: 0,
              left: 0,
              position: 'absolute',
              textTransform: 'uppercase',
            }}onClick={() => navigate('/')}>
        <ArrowBackIcon  fontSize="inherit" />
      </IconButton>
      
        <CardMedia
        component="img"
        height="600vh"
        weight="100%"
        objectFit='cover'
        position='absolute'
        image={workoutThumbnail}
        alt="workout thumbnail"
      />
        </Box>
        <CardContent sx={{minHeigth:500}}>
        <Stack margin='1%' direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="column" alignItems="left" justifyContent="space-between" mb={5}>
        <Typography variant="h3" component="div">
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
          <Typography padding='2%'variant="body2" color="text.secondary" sx={{
                color: 'text.disabled',
                wordBreak: "break-word"
              }}>
            {description}
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
        </CardContent>
        <Typography align="center" variant="body2" color="subtitle3">
            Workout cycles: {cycles}
          </Typography>

          {exercises && <TableContainer component={Paper}>
      <Table  sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order</StyledTableCell>
            <StyledTableCell align="left">Title</StyledTableCell>
            <StyledTableCell align="left">Repeats/Time</StyledTableCell>
            <StyledTableCell align="left">Series</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {exercises.map((exercise) => (
            <StyledTableRow key={exercise.order} onClick={() => {
              handleClickOpen(
                exercise.exercise.title, exercise.exercise.description, exercise.exercise.calories_burn_rate, 
                exercise.exercise.difficulty, exercise.exercise.exercise_type, exercise.exercise.thumbnail, exercise.exercise.video,
          )}}>
              <StyledTableCell component="th" scope="row">
                {exercise.order}
              </StyledTableCell>
              <StyledTableCell align="left">{exercise.exercise.title}</StyledTableCell>
              {exercise.time && <StyledTableCell align="left">{exercise.time} s</StyledTableCell>}
              {exercise.repeats && <StyledTableCell align="left">x{exercise.repeats}</StyledTableCell>}
              <StyledTableCell align="left">{exercise.series}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>}

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
        </DialogTitle>
        <DialogContent>
        <Box sx={{ pt: '90%', position: 'relative' }}>
        <ProductImgStyle alt={title} src={exe[5]} />
        <PlayImgStyle alt={title} src={icon} 
        onClick={() => {handleToggleVideo(exe[6])}}  />
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openVideo}
        onClick={handleCloseVideo}
      >
      {Video && <video autoPlay loop width="60%">
      <source src={Video} type="video/webm" />
      <source src={Video} type="video/mp4"
      />
               <CircularProgress color="inherit" />
    </video>}
      </Backdrop>
      </Box>
          {exe[0]}
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
          {styleAlert && <Typography>Workout added to Favorites</Typography>}
          {!styleAlert && <Typography>Workout deleted from Favorites</Typography>}
        </Alert>
      </Snackbar>

    </Page>
  );
}
