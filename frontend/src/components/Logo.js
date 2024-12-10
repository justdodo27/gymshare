import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import Avatar from '@mui/material/Avatar';
import icon from "../pictures/gymIcon.svg"

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  
  const logo = <Avatar sx={{ m: 1, bgcolor: 'background.main', width: 200, height: 100 , marginLeft: 2, marginTop: 4 }} variant="rounded" alt="logo" src={icon}/>



  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/gymshare/app">{logo}</RouterLink>;
}
