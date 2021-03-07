import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

function NavbarComponent() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">EduDraw</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
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
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
