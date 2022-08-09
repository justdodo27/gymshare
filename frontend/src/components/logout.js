import { useHistory } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../store/auth';
import { useEffect } from 'react';


export default function Logout() {
    const dispatch = useDispatch()
    const history = useHistory()
    dispatch(authActions.logout())
    useEffect(() => {
        history.replace('/');
      }, [history]);
}