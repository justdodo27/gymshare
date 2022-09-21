import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { ForgotForm } from 'src/sections/auth/forgot';
import AuthSocial from '../sections/auth/AuthSocial';

// ----------------------------------------------------------------------



const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 1000,
  margin: 'auto',
  minHeight: '75vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function Forgot() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">

        <Container maxWidth="sm">
          <ContentStyle>
            

            <ForgotForm />

  
          </ContentStyle>
        </Container>
    </Page>
  );
}
