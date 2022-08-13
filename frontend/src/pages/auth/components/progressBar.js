import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import colors from '../../colours.scss';


const theme = createTheme();

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? colors.blue : '#308fe8',
    },
    }));
    
class ProgressBar extends React.Component {
    render() {
        return <BorderLinearProgress 
        variant="determinate" 
        value={this.props.percentage} 
        //color="secondary"
        />
    }
}

export default ProgressBar;