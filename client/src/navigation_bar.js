import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function NavigationBar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" expand="lg" className="shadow-sm" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          SKILLBRIDGE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
            <Nav.Link as={NavLink} to="/opportunities">
              Opportunities
            </Nav.Link>

            {user?.role === "admin" && (
              <Nav.Link as={NavLink} to="/admin/opportunities">
                Manage Opportunities
              </Nav.Link>
            )}
          </Nav>

          {user && (
            <Button
              variant="outline-light"
              onClick={handleLogoutClick}
              className="ms-auto"
            >
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
