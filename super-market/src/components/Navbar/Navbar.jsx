import { Navbar, Container, Nav } from "react-bootstrap";

const TopNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container fluid>
        <Navbar.Brand>Item Management</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {/* <Nav.Link>Profile</Nav.Link>
            <Nav.Link>Settings</Nav.Link>
            <Button variant="outline-danger">Logout</Button> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
