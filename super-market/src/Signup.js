import "./Signup.css";
import React, { useState } from "react";
function Signup() {
  const [displayText, setDisplayText] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(true);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowForm(false);
    setDisplayText(
      "An account verification email has been sent to your email address"
    );
    var data = {
      first_name: form.firstName,
      last_name: form.lastName,
      email_id: form.email,
      platform_type: "web",
    };
    const auth = window.catalyst.auth;
    var signupResponse = await auth.signUp(data);

    debugger;
    if (signupResponse.status == 200) {
      setTimeout(function () {
        window.location.href = "index.html";
      }, 3000);
    } else {
      alert(signupResponse.message);
    }
  };
  return (
    <div id="signup" className="signup">
      {showForm ? (
        <div>
          <center>
            <img
              width="80px"
              height="80px"
              src="https://cdn2.iconfinder.com/data/icons/user-management/512/profile_settings-512.png"
            />
            <h1>User Profile Management</h1>
          </center>
          <form onSubmit={handleSubmit} className="modal-content">
            <center>
              <h1>Sign Up</h1>
              <p>Please fill this form to sign up for a new account.</p>
            </center>
            <label htmlFor="firstName">
              <b>First Name</b>
              <input
                name="firstName"
                className="inputs"
                placeholder="Enter First Name"
                value={form.firstName}
                onChange={(e) => {
                  setForm({
                    ...form,
                    firstName: e.target.value,
                  });
                }}
                required
              />
            </label>
            <label htmlFor="lastName">
              <b>Last Name</b>
              <input
                className="inputs"
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={(e) => {
                  setForm({
                    ...form,
                    lastName: e.target.value,
                  });
                }}
                required
              />
            </label>
            <label htmlFor="email">
              <b>Email</b>
              <input
                className="inputs"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });
                }}
                required
              />
            </label>
            <p>
              By creating an account, you agree to our{" "}
              <a
                href="https://www.zoho.com/catalyst/terms.html"
                target="_blank"
                rel="noopener noreferrer"
                id="link"
              >
                Terms & Conditions
              </a>
              .
            </p>
            <center>
              <input type="submit" value="Sign Up" className="signupfnbtn" />
            </center>
          </form>{" "}
        </div>
      ) : (
        <p>{displayText}</p>
      )}
    </div>
  );
}
export default Signup;
