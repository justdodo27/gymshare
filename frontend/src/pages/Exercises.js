import { filter } from 'lodash';
import { useState,forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import icon from "../pictures/play.png"
import nophotoicon from "../pictures/nophoto.jpg"
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer, Slide,
  TablePagination, Dialog, DialogTitle, DialogContent, Box, Backdrop, CircularProgress, DialogContentText, DialogActions
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import { useSelector} from 'react-redux';
import { authActions } from '../store/auth';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'difficulty', label: 'Difficulty', alignRight: false },
  { id: 'calories_burn_rate', label: 'Calories Burn Rate', alignRight: false },

];

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Exercises() {

  const dispatch = useDispatch()
  let exp = useSelector(state => state.auth.exp);
  let is_staff = useSelector(state => state.auth.is_staff);
  let token = useSelector(state => state.auth.token);
  const navigate = useNavigate()

  useEffect(() => {
    if (exp<parseInt(Date.now()/1000)) {
      dispatch(authActions.logout())
      navigate('/', {replace: true});
    }
  }, [dispatch, exp, navigate]);


  const [page, setPage] = useState(0);

  const [array, setArray] = useState([]);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('title');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [exe, setExe] = useState([]);
  const [openVideo, setOpenVideo] = useState(false);
  const [Video, setVideo] = useState('');
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
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


  const fetchMoviesHandler = useCallback(async () => {
    let next = true
    
    try {
      const response = await fetch(global.config.url + "workouts/exercises/");
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      const users = [...Array(data.results.length)].map((_, index) => ({
        id: data.results[index].id,
        avatarUrl: data.results[index].thumbnail ,
        title: data.results[index].title,
        type: data.results[index].exercise_type,
        calories_burn_rate: data.results[index].calories_burn_rate,
        difficulty: data.results[index].difficulty,
        description: data.results[index].description,
        video: data.results[index].video,
      }));

      next = data.next

      setArray(users)

      while(next!=null){
        try {
          const response = await fetch(next);
          if (!response.ok) {
            throw new Error('Something went wrong!');
          }
          const data = await response.json();

          const added = []
          data.results.forEach(exercise => added.push({id: exercise.id,
            avatarUrl: exercise.thumbnail ,
            title: exercise.title,
            type: exercise.exercise_type,
            calories_burn_rate: exercise.calories_burn_rate,
            difficulty: exercise.difficulty,
            description: exercise.description,
            video: exercise.video,}))
    
          next = data.next

    
          console.log(added)
          setArray(array => [...array, ...added])
    
        } catch (error) {
          return<p>Error</p>;
        }
      }

    } catch (error) {
      return<p>Error</p>;
    }


    ;
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = array.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleDeleteAlertClick = () => {
    setOpenDeleteAlert(true);
  };

  const handleDeleteAlertClose = () => {
    setOpenDeleteAlert(false);
  };

const handleClickDelete = (id) => {
  fetch(global.config.url + 'workouts/exercises/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " +token,
        },
      })
      .then(() => {navigate('/', { replace: true });})
      
};

  const handleCloseVideo = () => {
    setVideo('');
    setOpenVideo(false);
  };
  const handleToggleVideo = (src) => {
    setVideo(src);
    setOpenVideo(!openVideo);
  };

  const handleClick = (exercise) => {
    if(exercise[5] === ""){
      exercise[5] = nophotoicon
    }
    setExe(exercise);
    setOpen(true);
  };
  const handleClose = () => {
    setExe([]);
    setOpen(false);
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0;

  const filteredUsers = applySortFilter(array, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Exercise">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Exercises
          </Typography>
          {is_staff && <Button color="warning" variant="contained" component={RouterLink} to="/gymshare/addExercise" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Exercise (admin)
          </Button>}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={array.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, title, difficulty, type, avatarUrl, calories_burn_rate, description, video } = row;
                    const isItemSelected = selected.indexOf(title) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        difficulty="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={() => handleClick([title, description, calories_burn_rate, difficulty, type, avatarUrl, video, id] )}
                      >
                        
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, title)} /> */}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={title} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">
                        <StyledRating
       
        value={difficulty/2}
        readOnly
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
                        </TableCell>
                        <TableCell align="left">{calories_burn_rate}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={array.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <ProductImgStyle alt={exe[0]} src={exe[5]} />
        <PlayImgStyle alt={exe[0]} src={icon} 
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
      <Stack marginTop='2%' direction="row" alignItems="left" justifyContent="space-between" >
        <Typography variant="h4">  
          {exe[0]}
          </Typography>
          {is_staff  && <IconButton aria-label="delete" size="large" color={ is_staff && ('warning' ||"secondary")} onClick={() => handleDeleteAlertClick()} >
            <DeleteIcon  fontSize="inherit" />
              </IconButton>}
        </Stack>
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

      <Dialog
        open={openDeleteAlert}
        onClose={handleDeleteAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Watch out!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          This action will delete "{exe[0]}" forever. Are You sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAlertClose}>Cancel</Button>
          <Button color="warning" onClick={() => handleClickDelete(exe[7])} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
