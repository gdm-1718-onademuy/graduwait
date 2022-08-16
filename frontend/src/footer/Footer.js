import React, {useState} from "react";
import { Container, Grid, Box }from '@material-ui/core'
import {useTranslation} from 'react-i18next';


const Footer = ( ) => {
    const { t } = useTranslation()

    return(
        <footer>
            <Box>
                <Container maxWidth="lg">
                    <p> {t("Menu.6")}</p>
                </Container>
            </Box>
        </footer>
    )
}

export default Footer;