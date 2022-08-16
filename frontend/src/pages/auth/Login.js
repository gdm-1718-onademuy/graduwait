// rfce en enter drukken
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, Alert, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Container, Typography} from '@mui/material';
import "./auth.scss";
import { passwordValidator, emailValidator } from "../../services/functions/validations";
import colors from '../colours.scss';
import Footer from "../../footer/Footer";
import logo from '../../full_logo_closer.png';


const theme = createTheme();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [errorChecked, setErrorChecked] = useState("");
  


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget)
    const response = await signInWithEmailAndPassword(data.get('email'), data.get('password'))
    if (response) {
      setErrorChecked("Incorrect email and/or password.")
    }
    console.log("error:", response)

    // nog checken als het klopt, en anders de setErrorChecked doen 
  }
  return (
    <>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          height: '90vh',                        
          overflow: 'auto'
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
    { errorChecked && <Alert sx={{ mt: 2, width: '100%' }} severity="error">{errorChecked}</Alert>}


        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            value={email}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={! emailValidator(email) || email === ""}
            helperText={emailValidator(email) ? '' : 'Please write a correct email address.'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            error={! passwordValidator(password) ||  password === ""}
            helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter and a digit.'}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Grid item xs={20} sx={{ m: 1, p: -1}} >
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
          />
          </Grid>
          <Grid item xs={12} sx={{ mt: 3}}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{  mb: 2 }}
              style={{
                backgroundColor: colors.purple,
                color: 'white'
              }}
            >
              Login
            </Button>
          </Grid>
          </Box>

        <Box sx={{ mt: 3 }}>
          <Grid item xs={12} sx={{ mt: 1}}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            onClick={() => navigate('/')}
            style={{
              color: colors.purple
            }}
          >
            Are you new here? Register. 
          </Button>
          </Grid>

          <Grid item xs={12} sx={{ mt: 1}}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            onClick={() => navigate('/forgot')}
            style={{
              color: colors.purple
            }}
          >
            Did you forget your password?
          </Button>
          </Grid>
        </Box>
          </Box>
        
      </Paper>
      
      </Box>
    </Container>
    </ThemeProvider>
    <Footer/>
    </>
  );
}
export default Login;