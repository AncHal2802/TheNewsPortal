import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import "../cStyles/register_login.css";

const Login = ({ setLoginUser, userType }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailError, setEmailError] = useState(false);
  const handleEmail = (e) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === "") {
      setEmailError(false);
    } else if (!emailPattern.test(inputValue)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    setUser((prevUser) => ({ ...prevUser, email: inputValue }));
  };


  const [passErr, setPassErr] = useState(false);
  const handlePswd = (e) => {
    let pswd = e.target.value;
    if (pswd.trim() === "") {
      setPassErr(false);
    } else if (pswd.length < 6) {
      setPassErr(true);
    } else {
      setPassErr(false);
    }
    setUser((prevUser) => ({ ...prevUser, password: pswd }));
  };

  const login = (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (!emailPattern.test(email)) {
      setEmailError(true);
    } else if (password.length < 6) {
      setPassErr(true);
    } else {

      const updatedUser = { ...user, userType };

      axios.post("http://localhost:3000/login", updatedUser)
  .then((res) => {
    alert(res.data.message);
    if (res.data.status === "ok") {
      window.localStorage.setItem("userLogged", true);
      window.localStorage.setItem("userID", res.data.user._id);
      window.localStorage.setItem("userType", res.data.user.userType);

      setLoginUser(res.data.user);
      if (res.data.userType === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      
      console.error("Login failed:", res.data.message);
    }
  })
  .catch((error) => {
    // Handle any network or other errors that may occur during the login request
    console.error("Error during login:", error);
    // Optionally, display an error message to the user
    alert("Error during login. Please try again.");
  });

    }
  };


  return (
    <>
      <div className="loginPage flexDiv">
        <div className="contanier flexDiv">
          <div className="videoDiv w-[60%] h-[60%]">
            <video src='/videos/Video1.mp4' autoPlay muted loop></video>

            <div className="textDiv">
              <h2 className="title">The News Portal </h2>
              <p>Engage, Explore, Evolve</p>
            </div>
            <div className="footerDiv flexDiv">
              <span className="text">Don't have an account? </span>
              <Link to={"/register"}>
                <button className="btn">Sign Up</button>
              </Link>
            </div>
          </div>

          <div className="fromDiv flexDiv">
            <div className="headerDiv overflow-hidden">
              <h1>The News Portal</h1>

              <h3>Welcome Back Guys!!</h3>
            </div>
            <form onSubmit={login} className="form">
              <div className="inputDiv">
                <label htmlFor="username">Email ID</label>
                <div className="input flexDiv">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleEmail}
                    required
                    placeholder="Enter your Email"
                  ></input>
                </div>
                {emailError ? (
                  <span className="error">Email Not Valid</span>
                ) : (
                  ""
                )}
              </div>
              <div className="inputDiv">
                <label htmlFor="password">Password</label>
                <div className="input flexDiv">
                  <BsFillShieldLockFill className="icon" />
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handlePswd}
                    required
                    placeholder="Enter your Password"
                  ></input>
                </div>
                {passErr ? (
                  <span className="error">
                    Password must have 6 characters{" "}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <br></br>

              <button type="submit" className="btn flexDiv">
                <span>Login</span>
                <AiOutlineSwapRight className="icon" />
              </button>
              <br></br>
              <span className="forgotPassword">
                Forgot password? <Link to="/forgotpassword">Click Here</Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
