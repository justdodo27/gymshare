
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../store/auth';
import { useEffect } from 'react';


export default function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    dispatch(authActions.logout())
    useEffect(() => {
        navigate('/', {replace: true});
      }, [navigate]);
}