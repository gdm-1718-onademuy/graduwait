import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
//import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import colors from '../../colours.scss';
import { Button } from '@material-ui/core';




const ButtonNewHere = () => {
    const navigate = useNavigate();
    return (

            <Grid item xs={12} sx={{ mt: 3}}>
                <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    //color="primary"
                    style={{
                    color: colors.purple
                    }}
                >
                    Do you already have an account? Login
                </Button>
            </Grid>
    )
}

export default ButtonNewHere; 