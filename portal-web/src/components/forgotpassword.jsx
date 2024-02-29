import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    axios.post("http://localhost:3000/forgotpassword", { email: email }).then((res) => {
        alert(res.data.message);
        navigate("/login");
      });
  };

  const isLoggedIn = window.localStorage.getItem("loggedIn");
  console.log(window.localStorage.getItem("user-role"));

  if (isLoggedIn == "true") {
    return window.location.href = "/";
  }
  return (
    <div className="flex justify-center items-center bg-secondary h-screen">
      <div className="bg-white p-3 rounded w-1/4">
        <h4 className="text-2xl font-bold mb-3">Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="block font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input rounded-0 w-full"
            />
          </div>
          <button
            type="submit"
            className="btn bg-success text-white w-full rounded-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
