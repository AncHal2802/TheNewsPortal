import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../cStyles/register_login.css';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    axios
      .post("http://localhost:3000/forgotpassword", { email: email })
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
  //   return (window.location.href = "/");
  // }
  return (
    <div className="forgotPasswordPage">
      <div className="forgotPasswordForm">
      <center><h3 className="text-2xl font-bold mb-3">Forgot Password</h3></center>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="block font-semibold">
              <center><h4>Email</h4></center>
            </label>
            <br />
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input bg-slate-600 rounded-0 w-full"
            />
          </div>
          <br />
          <button
            type="submit"
            className="btn bg-success text-yellow w-full rounded-0">
              <center>Send</center>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;