import React, { useState, useEffect } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

function NavbarComponent() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      console.log("hi");
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const DisplayLogout = () => {
    if (!loggedIn) {
      return (
        <Nav className="flex-row-reverse">
          <Nav.Link href="/register">Register</Nav.Link>
          <NavDropdown title="Login" id="collasible-nav-dropdown">
            <NavDropdown.Item href="/authenticate/staff">
              Staff
            </NavDropdown.Item>
            <NavDropdown.Item href="/authenticate/student">
              Student
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
    }

    return (
      <Nav className="flex-row-reverse">
        <Nav.Link href="/" onClick={handleLogout}>
          Logout
        </Nav.Link>
        <Nav.Link href="/profile">My Account</Nav.Link>
        <Nav.Link href="/rooms">Rooms</Nav.Link>
      </Nav>
    );
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">EduDraw</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <DisplayLogout />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
