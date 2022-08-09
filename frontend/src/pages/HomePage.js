import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import Main from '../components/mainPage';
import Home from '../components/homePage';

const HomePage = () => {
    const isAuth = useSelector(state => state.auth.isAuthenticated);
  
    return (
    <Fragment>
    {!isAuth && <Main/>}
    {isAuth && <Home/>}
    </Fragment>
  );
    
  }
  
  export default HomePage;