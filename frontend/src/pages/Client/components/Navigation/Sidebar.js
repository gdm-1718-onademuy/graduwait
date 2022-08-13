import React from 'react';
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, NavBtnLink } from './SidebarElements';
import { Button } from '@mui/material';
import { logout } from "../../../../services/config/firebase";

//import {Link as LinkS} from 'react-scroll';
//import {Link as LinkR} from 'react-router-dom';

const Sidebar = ({isOpen, toggle}) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/dashboard" onClick={toggle}>Dashboard</SidebarLink>
                    <SidebarLink to="/myagenda/me" onClick={toggle}>My agenda</SidebarLink>
                    <SidebarLink to="/profile" onClick={toggle}>Profile</SidebarLink>
                    <SidebarLink to="/history" onClick={toggle}>History</SidebarLink>
                    <SidebarLink to="/info" onClick={toggle}>Info</SidebarLink>
                    <NavBtnLink to="/" color="primary" variant="contained" onClick={logout}>
                    Logout
                    </NavBtnLink>
                </SidebarMenu>
                <SideBtnWrap>
                    
                </SideBtnWrap>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
