import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
//import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Button, Box, Container, Alert, Paper } from '@mui/material';
import { createTheme, easing, ThemeProvider } from '@mui/material/styles';
import logo from  '../../../full_logo_closer.png';
//import { appTheme } from "../../themes/theme";
import { green, purple } from '@mui/material/colors';
import colors from '../../colours.scss';




const LayoutForms = ({children}) => {
  const navigate = useNavigate();
  const [errorForm, setErrorForm] = useState("");
  //const errorRegister = props.errorRegister

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
  

  return (
  <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <Box
          sx={{
          marginTop: 4,
          display: 'block',
          flexDirection: 'column',
          alignItems: 'center',
          verticalAlign: 'middle'
        }}
      >   
          <Paper
            sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '85vh',                        
            overflow: 'auto',
            }}
        >
          
          <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <img width="35%" height="35%" src={logo} alt="logo"/>
        <Box component="form" noValidate autoComplete="off" /*onSubmit={handleSubmit}*/ sx={{ mt: 6 }}>
          <Grid container spacing={2}>

            {errorForm ?
              <Grid item xs={12} >
              <Alert severity="error">{errorForm}</Alert>
            </Grid>:
            <></>
            }

          {children}

          </Grid>
          </Box>
          </Box>
          </Paper>
          </Box>
          </Container>
          </ThemeProvider>
  )
}

export default LayoutForms; 