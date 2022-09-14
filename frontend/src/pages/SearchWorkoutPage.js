import SearchWorkout from "../components/searchWorkout";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "../components/header.js"
import { Fragment } from "react";

import { sections } from "../components/homePage";
import { theme } from "../components/homePage";

const SearchWorkoutPage = () => {
  return (
    <Fragment>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Gymshare" sections={sections} />
      </Container>
      </ThemeProvider>
  <SearchWorkout />
  </Fragment>
  ) 
};

export default SearchWorkoutPage;