import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import Forgot from './pages/ForgotPassword';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddWorkout from './pages/AddWorkout';
import ChangePassword from './pages/ChangePassword';
import AddExerciseToWork from './pages/AddExerciseToWork';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function Router() {

  let isAuth = useSelector(state => state.auth.isAuthenticated);

  return useRoutes([
    {
      path: '/gymshare',
      element: <DashboardLayout />,
      children: [
        { path: 'profile', element: isAuth ? (<Profile /> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'editProfile', element: isAuth ? (<EditProfile/> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'workouts', element: isAuth ? (<User /> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'app', element: <Products /> },
        { path: 'statistics', element: isAuth ? (<DashboardApp /> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'addWorkout', element: isAuth ? (<AddWorkout /> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'changePassword', element: isAuth ? (<ChangePassword /> ) : (<Navigate to="/gymshare/app" />  )},
        { path: 'addExerciseToWork', element: isAuth ? (<AddExerciseToWork /> ) : (<Navigate to="/gymshare/app" />  )},
      ],
    },
    {
      path: 'login',
      element: !isAuth ? (<Login /> ) : (<Navigate to="/gymshare/app" />  ),
    },
    {
      path: 'register',
      element: !isAuth ? (<Register /> ) : (<Navigate to="/gymshare/app" />  ),
    },
    {
      path: 'forgot',
      element: !isAuth ? (<Forgot /> ) : (<Navigate to="/gymshare/app" />  ),
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/gymshare/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/',
      element: <Navigate to="/gymshare/app" replace />,
    },
  ]);
}
