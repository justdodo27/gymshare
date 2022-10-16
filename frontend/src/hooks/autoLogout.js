import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { authActions } from '../store/auth';
import { useSelector} from 'react-redux';


export default function AutoLogout() {
    const dispatch = useDispatch()
    let exp = useSelector(state => state.auth.exp);
    const navigate = useNavigate()
    return () => {
        if (exp<parseInt(Date.now()/1000)) {
            dispatch(authActions.logout())
            navigate('/', {replace: true});
        }
    }
  }