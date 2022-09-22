// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/gymshare/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'profile',
    path: '/gymshare/profile',
    icon: getIcon('eva:person-fill'),
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
];

export default navConfig;
