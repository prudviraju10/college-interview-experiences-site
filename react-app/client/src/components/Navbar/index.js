import React from "react";
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from "./Menuitems";
const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>React</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/home" activeStyle>
            Home
          </NavLink>
          <NavLink to="/writeblog" activeStyle>
            Writeblog
          </NavLink>
          <NavLink to="/dashboard" activeStyle>
            Dashboard
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/login">Login</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
