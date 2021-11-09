import React from 'react';
import {Nav,NavLink,Bars,NavMenu,NavBtn} from './navbarElements';
import LoginButton from '../loginButton';
import '../../App.css';

const Navbar = ({toggle}) => {
    return (
        <>
            <Nav>
                <NavLink to="/" style={{color:"#447cc4"}}>
                    <img src="/logo.png" alt="NeuraSearch logo" style={{width:"4rem",height:"4rem",borderRadius:"1rem"}}/>
                    <h1 style={{paddingLeft:"1rem"}}>Crypto Dashboard</h1>
                </NavLink>
                <Bars onClick={toggle}/>
                <NavMenu>
                <NavLink exact to="/" activeClassName="active">
                    Market
                    </NavLink>
                    <NavLink to="/portfolio" activeClassName="active">
                    Portfolio
                    </NavLink>
                    <NavLink to="/bots" activeClassName="active">
                    Bots
                    </NavLink>
                </NavMenu>
                <NavBtn><LoginButton/></NavBtn>
            </Nav>
        </>
    )
}

export default Navbar;
