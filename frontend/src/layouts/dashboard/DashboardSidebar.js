import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';

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
const userId = useSelector(state => state.auth.userId);
let token = useSelector(state => state.auth.token)
const [photo, setPhoto] = useState(null)

const fetchData = () => {

  fetch("http://localhost:1337/accounts/profiles/" +userId, {
    headers: {
      Authorization: "Bearer " +token
    },
  })

    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      if(data.profile_picture){ setPhoto(data.profile_picture) }
      else {setPhoto(account.photoURL)}
      console.log(photo)
    })
}

useEffect(() => {
  fetchData()
}, [])

const navConfig = isAuth ? [
  {
    title: 'dashboard',
    path: '/gymshare/app',
    icon: getIcon('eva:globe-2-fill'),
  },
  {
    title: 'workouts',
    path: '/gymshare/workouts',
    icon: getIcon('eva:grid-fill'),
  },
  {
    title: 'exercises',
    path: '/gymshare/exercises',
    icon: getIcon('eva:grid-outline'),
  },
  {
    title: 'statistics',
    path: '/gymshare/statistics',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'logout',
    path: '/gymshare/logout',
    icon: getIcon('eva:person-fill'),
  },
] : [
  {
    title: 'dashboard',
    path: '/gymshare/app',
    icon: getIcon('eva:globe-2-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:person-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
];

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

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

      {isAuth && <Box  sx={{ mb: 5, mx: 2.5, '&:hover': {
          opacity: [0.1, 0.1, 0.8],
        }, }}>
      <Link underline="none" component={RouterLink} to="/gymshare/profile">
          <AccountStyle>
            <Avatar src={photo} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {username}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
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
