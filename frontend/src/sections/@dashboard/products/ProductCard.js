import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, CardActionArea, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Label from '../../../components/Label';
import icon from "../../../pictures/nophoto.jpg"
import { useDispatch } from 'react-redux';
import { workoutActions } from '../../../store/workout';
import { useNavigate} from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Rating from '@mui/material/Rating';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};


export default function ShopProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    visibility,
    thumbnail
    } = product;
    let source =''
    if(thumbnail){
      source=thumbnail
    }
    else{
      source=icon
    }

    const handleClick = (workoutId) => {
      dispatch(workoutActions.getWorkout(workoutId))
      navigate('/gymshare/workoutDetail', { replace: true });
    };

  return (
    <Card>
      <CardActionArea onClick={() => {
          handleClick(id)
        }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
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
        <ProductImgStyle alt={title} src={source} />
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
              }}
            >
              @{author.username}
            </Typography>
          </Typography>
          
        </Stack>
        <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body3"
              sx={{
                color: 'text.disabled',
              }}
            >
              difficulty
            </Typography>
          </Typography>
        <StyledRating
       
        value={parseFloat(difficulty)/2}
        readOnly
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
    
      </Stack>
      </CardActionArea>
    </Card>
  );
}
