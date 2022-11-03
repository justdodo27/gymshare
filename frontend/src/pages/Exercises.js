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
  TablePagination, Dialog, DialogTitle, DialogContent, Box, Backdrop, CircularProgress, DialogContentText
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
import { workoutActions } from '../store/workout';
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
  { id: 'cbr', label: 'Calories Burn Rate', alignRight: false },

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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Exercises() {

  const dispatch = useDispatch()
  let exp = useSelector(state => state.auth.exp);
  let is_staff = useSelector(state => state.auth.is_staff);
  console.log(is_staff)
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

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [exe, setExe] = useState([]);
  const [openVideo, setOpenVideo] = useState(false);
  const [Video, setVideo] = useState('');
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
    
    try {
      const response = await fetch("http://localhost:1337/workouts/exercises/");
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      console.log('Hello')
      console.log(data)

      const users = [...Array(data.length)].map((_, index) => ({
        id: data[index].id,
        avatarUrl: data[index].thumbnail ? data[index].thumbnail : "/pictures/nophoto.jpg",
        name: data[index].title,
        company: data[index].exercise_type,
        isVerified: data[index].calories_burn_rate!=null ? data[index].calories_burn_rate : 0,
        role: data[index].difficulty!=null ? data[index].difficulty : 0,
        description: data[index].description,
        video: data[index].video,
      }));

      console.log(users)
      setArray(users)

      

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
      const newSelecteds = array.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickDelete = () => {
    // fetch('http://localhost:1337/workouts/plans/'+workoutId, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: "Bearer " +token,
    //       },
    //     })
    //     .then(() => {navigate('/', { replace: true });})
        
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
    console.log(exercise)
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
            Workouts
          </Typography>
          {is_staff && <Button color="warning" variant="contained" component={RouterLink} to="/gymshare/addExercise" startIcon={<Iconify icon="eva:alert-circle-outline" />}>
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
                    const { id, name, role, company, avatarUrl, isVerified, description, video } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={() => handleClick([name, description, isVerified, role, company, avatarUrl, video] )}
                      >
                        
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{company}</TableCell>
                        <TableCell align="left">
                        <StyledRating
       
        value={role/2}
        readOnly
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
                        </TableCell>
                        <TableCell align="left">{isVerified}</TableCell>
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
          {exe[0]}
          {is_staff  && <IconButton aria-label="delete" size="large" color={ is_staff && 'warning' ||"secondary"} onClick={() => handleClickDelete()}>
                          <DeleteIcon  fontSize="inherit" />
                        </IconButton>}
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
    </Page>
  );
}
