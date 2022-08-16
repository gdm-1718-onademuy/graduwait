import React from "react";
import { Grid, Box, Container, Paper, createTheme } from '@mui/material';

// styling
import colors from '../../../colours.scss';
import CssBaseline from '@mui/material/CssBaseline';


const LayoutFull = ({children}) => {

  const theme = createTheme({
      palette: {
          primary: {
            main: colors.purple,
            light: colors.light_purple,
          },
          secondary: {
            main: colors.blue,
          },
        },
  });
  
  return ( <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
      component="main"
      sx={{
          backgroundColor: (theme) =>
          theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
      }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '75vh'}}>
              {children}
            </Paper>
          </Grid>
        </Container>
      </Box>
    </Box>
  </> )
}

export default LayoutFull; 