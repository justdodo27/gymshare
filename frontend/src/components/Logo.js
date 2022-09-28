import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import Avatar from '@mui/material/Avatar';
import icon from "../pictures/icon.jpg"

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  
  const logo = <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 70, height: 70, marginLeft: 10, marginTop: 4 }} alt="logo" src={icon}/>



  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/gymshare/app">{logo}</RouterLink>;
}
