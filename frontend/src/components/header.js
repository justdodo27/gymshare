import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import icon from "../pictures/icon.jpg"
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';

function Header(props) {
  const { sections, title } = props;

  return (
    <React.Fragment>
            <Typography
          component="h1"
          variant="h2"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
      <Grid container spacing={2} sx={{ borderBottom: 1, borderColor: 'divider', margin:'auto' }}>
        <Grid item xs = {4}>
        <Toolbar >
        <Link component={RouterLink} to='/' color="inherit">
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }} alt="logo" src={icon}>
          </Avatar>
        </Link>
      </Toolbar>
        </Grid>
        <Grid item xs = {8}>
        <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'right', overflowX: 'auto'}}
      >
        {sections.map((section) => (
          <Link
            component={RouterLink} to={section.url}
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            sx={{ p: 1, flexShrink: 0 }}
          >
            <Button size='large'>{section.title}</Button>
            
          </Link>
        ))}
      </Toolbar>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;