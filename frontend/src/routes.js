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

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/gymshare',
      element: <DashboardLayout />,
      children: [
        { path: 'profile', element: <Profile />, },
        { path: 'editProfile', element: <EditProfile /> },
        { path: 'workouts', element: <User /> },
        { path: 'app', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'statistics', element: <DashboardApp /> },
        { path: 'addWorkout', element: <AddWorkout /> },
        { path: 'changePassword', element: <ChangePassword />, },
        { path: 'addExerciseToWork', element: <AddExerciseToWork />, },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'forgot',
      element: <Forgot />,
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
