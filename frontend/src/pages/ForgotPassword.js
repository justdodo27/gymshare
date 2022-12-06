import { styled } from '@mui/material/styles';
import { Container} from '@mui/material';
// components
import Page from '../components/Page';
// sections
import { ForgotForm } from 'src/sections/auth/forgot';

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
