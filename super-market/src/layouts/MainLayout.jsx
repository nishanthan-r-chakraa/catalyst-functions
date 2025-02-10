import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";
import TopNavbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Login from "../LoginPage";

const MainLayout = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    window.catalyst.auth
      .isUserAuthenticated()
      .then((result) => {
        console.log(result);
        setIsUserAuthenticated(true);
      })
      .catch((err) => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  if (isFetching) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth
  }

  if (!isUserAuthenticated) {
    return <Login />; // Redirect to the Login component if not authenticated
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <TopNavbar />
        <Container fluid>{children}</Container>
      </div>
    </div>
  );
};

export default MainLayout;
