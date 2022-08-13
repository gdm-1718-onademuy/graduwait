import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtnLink} from './NavbarElements';
import { logout } from "../../../../services/config/firebase";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useTranslation} from 'react-i18next';
import logo from '../../../../navigation_graduwait.png';



const Navbar = ({toggle}) => {
    const { t, i18n } = useTranslation()

    const handleClick = (lang) => {
        i18n.changeLanguage(lang)
    }

    return (
        <>
        <Nav>
            <NavLink to="/dashboard">
                <img width="100%" height="40%" src={logo} alt="logo" style={{margin:'20px'}}/>
            </NavLink>
            <Bars onClick={toggle} />
            <NavMenu>
            <NavLink to="/dashboard" activeStyle>{t('Menu.1')}</NavLink>
                <NavLink to="/myagenda/me" activeStyle>{t('Menu.2')}</NavLink>
                <NavLink to="/profile" activeStyle>{t('Menu.3')}</NavLink>
                <NavLink to="/history" activeStyle>{t('Menu.4')}</NavLink>
                <NavLink to="/info" activeStyle>{t('Menu.5')}</NavLink>
                <ButtonGroup variant="text" aria-label="outlined primary button group">
                    <Button style={{
                  backgroundColor: 'black',
                  color: 'white'
                }}onClick={()=>handleClick('en')}>En</Button>
                    <Button style={{
                  backgroundColor: 'black',
                  color: 'white'
                }}onClick={()=>handleClick('nl')}>Nl</Button>
                </ButtonGroup>
                <NavBtnLink to="/" color="primary" variant="contained" onClick={logout}>
                    Logout
                </NavBtnLink>
            </NavMenu>
        </Nav>
        </>
    )
}

export default Navbar
