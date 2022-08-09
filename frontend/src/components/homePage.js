import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "../components/header.js"
import { blueGrey, indigo } from '@mui/material/colors';


const sections = [
  { title: 'Change Password', url: '/change' },
  { title: 'Forgot Password', url: '/forgot' },
  { title: 'Your Profile', url: '/profile' },
  { title: 'Edit Profile', url: '/edit' },
  { title: 'Logout', url: '/logout' },
];


const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: blueGrey[800],
      },
      primary: {
        main: indigo[50],
      },
      secondary: {
        main: indigo[50],
      }
    },
  }
  );

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Gymshare" sections={sections} />
      </Container>
    </ThemeProvider>
  );
}