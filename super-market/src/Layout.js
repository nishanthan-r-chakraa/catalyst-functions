import UserProfile from "./UserProfile";
import LoginPage from "./LoginPage.js";
import { useEffect, useState } from "react";
function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    mailid: "",
    timeZone: "",
    createdTime: "",
    roleName: "",
  });
  useEffect(() => {
    window.catalyst.auth
      .isUserAuthenticated()
      .then((result) => {
        console.log(result);
        let userDetails = {
          firstName: result.content.first_name,
          lastName: result.content.last_name,
          mailid: result.content.email_id,
          timeZone: result.content.time_zone,
          createdTime: result.content.created_time,
          roleName: result.content.role_details.role_name,
        };
        setUserDetails(userDetails);
        setIsUserAuthenticated(true);
      })
      .catch((err) => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);
  return (
    <>
      {isFetching ? (
        <p>Loading ….</p>
      ) : isUserAuthenticated ? (
        <UserProfile userDetails={userDetails} />
      ) : (
        <LoginPage />
      )}
    </>
  );
}
export default Layout;
