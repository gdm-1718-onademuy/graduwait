import styled from 'styled-components';
import {FaTimes} from 'react-icons/fa';
//import {Link as LinkS} from 'react-scroll';
//import {Link as LinkR} from 'react-router-dom';
import { NavLink as Link } from 'react-router-dom'
import colors from '../../../colours.scss';

export const SidebarContainer = styled.aside`
    background: ${colors.dark};
    display: grid;
    z-index: 999;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
    align-items: center;
    pacity: ${({isOpen}) => (isOpen? '100%' : '0')};
    top:  ${({isOpen}) => (isOpen? '0' : '-100%')};

`;

//    opacity: ${({isOpen}) => (isOpen? '100%' : '0')};
//    top:  ${({isOpen}) => (isOpen? '0' : '-100%')};


export const CloseIcon = styled(FaTimes)`
    color: #fff;
`;

export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;
    outline: none;
`;

export const SidebarWrapper = styled.div`
    color: #fff;
`;

export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 80px);
    text-align: center;
    justify-content: center;

    @media screen and(max-width: 480px){
        grid-template-rows: repeat(6,60px);
    }
`;

//export const SidebarLink = styled(LinkS)`
export const SidebarLink = styled(Link)`
    display: flex;
    //align-itmes: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition: 0.2s ease-in-out;
    text-decoration: none;
    color: #fff;
    cursor: pointer;

    &:hover {
        color: ${colors.blue};
        transition: 0.2s ease-in-out;

    }
`;

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
`;

export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    padding: 10px 22px;
    margin: 20px;
    color: ${colors.blue};
    border: none;
    outline: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover{
        transition: all 0.2s ease-in-out;
        color: ${colors.light_purple};
    }
`
/*
export const SidebarRoute = styled(LinkR)`
    border-radius: 50px;
    background: #01bf71;
    white-space: nowrap;
    padding: 16px 64px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: ${color.blue};
    }
`;
*/

