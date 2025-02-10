import Button from "./Button";
import "./UserProfile.css";
function UserProfile({ userDetails }) {
  return (
    <div className="card">
      <nav>
        <a href="#/">Home</a> | <a href="#/items">Items</a>
      </nav>

      <h1 className="title">User Profile Information</h1>
      <img
        alt="usericon"
        id="userimg"
        width="200px"
        height="450px"
        src="https://cdn2.iconfinder.com/data/icons/user-management/512/profile_settings-512.png"
      />
      <p className="title">Role : {userDetails.roleName}</p>
      <p className="title">First Name : {userDetails.firstName}</p>
      <p className="title">Last Name: {userDetails.lastName}</p>
      <p className="title">Email Address: {userDetails.mailid}</p>
      <p className="title">Time Zone: {userDetails.timeZone}</p>
      <p className="title">Joined On: {userDetails.createdTime}</p>
      <Button title="Logout"> </Button>
    </div>
  );
}
export default UserProfile;
