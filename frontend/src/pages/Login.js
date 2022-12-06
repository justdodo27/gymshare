import { styled } from '@mui/material/styles';
import { Container,} from '@mui/material';
// components
import Page from '../components/Page';
// sections
import { LoginForm } from '../sections/auth/login';

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

export default function Login() {

  return (
    <Page title="Login">

        <Container maxWidth="sm">
          <ContentStyle>
            

            <LoginForm />

  
          </ContentStyle>
        </Container>
    </Page>
  );
}
