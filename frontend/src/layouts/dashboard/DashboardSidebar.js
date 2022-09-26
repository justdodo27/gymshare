import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, Menu, MenuItem } from '@mui/material';

// mock
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import Iconify from '../../components/Iconify';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

let isAuth = useSelector(state => state.auth.isAuthenticated);
const username = useSelector(state => state.auth.username);

const navConfig = isAuth ? [
  {
    title: 'dashboard',
    path: '/gymshare/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'workouts',
    path: '/gymshare/workouts',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'statistics',
    path: '/gymshare/statistics',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'profile',
    path: '/gymshare/profile',
    icon: getIcon('eva:person-fill'),
  },
] : [
  {
    title: 'dashboard',
    path: '/gymshare/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
];

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      {isAuth && <Box sx={{ mb: 5, mx: 2.5 }}>
          <AccountStyle>
          <Button
        style={{minWidth: '100%'}}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        >
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {username}
              </Typography>
            </Box>
            </Button>
          </AccountStyle>
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose} component={RouterLink} to="/gymshare/ChangePassword">Change Password</MenuItem>
        <MenuItem onClick={handleClose} component={RouterLink} to="/gymshare/Logout">Logout</MenuItem>
      </Menu>
      </Box>}

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
