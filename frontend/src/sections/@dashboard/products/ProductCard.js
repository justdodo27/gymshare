import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import { ColorPreview } from '../../../components/color-utils';
import icon from "../../../pictures/icon.jpg"

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  console.log(product)
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
    } = product;

  return (
    <Card>
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
        <ProductImgStyle alt={title} src={icon} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
              }}
            >
              {author.username}
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
