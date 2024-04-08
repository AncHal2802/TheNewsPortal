import React from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../cStyles/register_login.css';

function ResetPassword() {
  const [user, setUser] = useState([]);
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [passMatchErr, setPassMatchErr] = useState(false);
  const comparePassword = password;
  const passMatchHandler = (e) => {
    let rePass = e.target.value;

    if (rePass.trim() === "") {
      setPassMatchErr(false);
    } else if (rePass !== comparePassword) {
      // console.log("cp: " + comparePassword);
      setPassMatchErr(true);
    } else {
      setPassMatchErr(false);
    }

    setUser((prevUser) => ({ ...prevUser, reEnterPassword: rePass }));
  };

  // axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password);
    axios
      .post(`http://localhost:3000/reset-password/${id}/${token}`, { password })
      .then((res) => {
        alert(res.data.message);
        if (res.data.status == "ok") {
          navigate("/login");
         
        }
      });
  };

  // const isLoggedIn = window.localStorage.getItem("loggedIn");
  // console.log(window.localStorage.getItem("user-role"));

  // if (isLoggedIn == "true") {
  //     return window.location.href = "/";
  // }
  return (
    <div className="resetPasswordPage">
      <div className="resetPasswordFormContainer">
        <div className="bg-blue-400 p-3 rounded resetPasswordForm">
          <h2>Reset Password</h2>
          <br /><br />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong><h3>New Password</h3></strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                name="password"
                className="form-control bg-slate-600  rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br  />
            <div className="mb-3">
              <label htmlFor="email">
                <strong><h3>Confirm New Password</h3></strong>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
                name="reEnterPassword"
                className="form-control bg-slate-600  rounded-0"
                onChange={passMatchHandler}
              />
            </div>
            {passMatchErr ? <span className="error">Mismatch Password</span> : ""}
            <button
            type="submit"
            className="btn bg-success text-yellow w-full rounded-0">
              <center>Update</center>
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;