import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

export default function NavigationBar() {
  return (
    <Navbar bg="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Website Name */}
        <Navbar.Brand as={Link} to="/">
          SKILLBRIDGE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Page Links */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/courses">
              Courses
            </Nav.Link>
            <Nav.Link as={NavLink} to="/networks">
              Networks
            </Nav.Link>
          </Nav>

          {/* Login/Register */}
          <Nav>
            <Button
              as={Link}
              to="/login"
              variant="outline-primary"
              className="me-2"
            >
              Login
            </Button>
            <Button as={Link} to="/register" variant="primary">
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
