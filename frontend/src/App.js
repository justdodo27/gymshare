import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfileViewPage from './pages/ProfileViewPage';
import EditProfilePage from './pages/EditProfilePage';
import LogoutPage from './pages/LogoutPage';
import { useSelector } from 'react-redux';
import ConfirmPasswordPage from './pages/ConfirmPasswordPage';
import AddExercisePage from './adminPages.js/addExercisePage';
import AddExerciseToWorkoutPage from './pages/AddExerciseToWorkoutPAge';
import AddWorkoutPage from './pages/addWorkoutPage';



function App() {

  let isAuth = useSelector(state => state.auth.isAuthenticated);
  console.log(isAuth)

  return (
    <Switch>
    <Route path='/' exact>
      <HomePage />
    </Route>
    {!isAuth && (
          <Route path='/register'>
            <RegistrationPage />
          </Route>
        )}
    {!isAuth && (
          <Route path='/login'>
            <LoginPage />
          </Route>
        )}
    <Route path='/profile'>
      {isAuth && <ProfileViewPage />}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/change'>
      {isAuth && <ChangePasswordPage/>}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/forgot'>
      {!isAuth && <ResetPasswordPage/>}
      {isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/edit'>
      {isAuth && <EditProfilePage/>}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/logout'>
      {isAuth && <LogoutPage/>}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/confirm'>
      {!isAuth && <ConfirmPasswordPage/>}
      {isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/addExercise'>
      {isAuth && <AddExercisePage/>}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='/addExerciseToWorkOut'>
      {isAuth && <AddExerciseToWorkoutPage/>}
    <Route path='/addWorkout'>
      {isAuth && <AddWorkoutPage/>}
      {!isAuth && <Redirect to='/' />}
    </Route>
    <Route path='*'>
      <Redirect to='/' />
    </Route>
  </Switch>
  );
}

export default App;
