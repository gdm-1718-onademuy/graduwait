import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
//import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, easing, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
//import Autocomplete from "react-google-autocomplete";
//import Autocomplete from "@material-ui/lab/Autocomplete";
import Alert from '@mui/material/Alert';
import ProgressBar from './components/progressBar.js';
import Paper from '@mui/material/Paper';
import logo from '../../full_logo_closer.png';
import colors from '../colours.scss';

export default function UserForms() {
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/" variant="body2">
                  Go back   
                </Link>
              </Grid>
            </Grid>
            <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <img width="35%" height="35%" src={logo} alt="logo"/>
          </Box>
        </Paper>
        </Box>
        </Container>
        </ThemeProvider>
    )
}