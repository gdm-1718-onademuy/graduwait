import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LoggedIn from "../../auth/components/LoggedIn";
import InhoudDashboard from '../components/inhoudDashboard';
import Container from '@mui/material/Container';
import Footer from '../../../footer/Footer';

const mdTheme = createTheme();

function Dashboard() {
  return (
    <>
    <ThemeProvider theme={mdTheme}>
      <LoggedIn/>
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
          
              <InhoudDashboard/>
            
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    <Footer/>
    </>

  );
}

/*export default function Dashboard() {
  return <DashboardContent />
}*/
export default Dashboard;