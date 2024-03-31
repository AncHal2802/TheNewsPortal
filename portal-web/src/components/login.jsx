import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = ({ setLoginUser, userType }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailError, setEmailError] = useState(false);
  const [passErr, setPassErr] = useState(false);

  const handleEmail = (e) => {
    const inputValue = e.target.value;
    setUser((prevUser) => ({ ...prevUser, email: inputValue }));
    setEmailError(!emailPattern.test(inputValue));
  };

  const handlePswd = (e) => {
    const pswd = e.target.value;
    setUser((prevUser) => ({ ...prevUser, password: pswd }));
    setPassErr(pswd.length < 6);
  };

  const login = (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (emailError || passErr) {
      return; // Don't proceed if there are input errors
    }

    axios.post("http://localhost:3000/login", user)
      .then((res) => {
        alert(res.data.message);
        if (res.data.status === "ok") {
          window.localStorage.setItem("userLogged", true);
          window.localStorage.setItem("userID", res.data.user._id);
          window.localStorage.setItem("userType", res.data.user.userType);
          setLoginUser(res.data.user);
          navigate(res.data.userType === 'admin' ? "/admin" : "/");
        } else {
          console.error("Login failed:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
      });
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
                {emailError && <span className="error">Email Not Valid</span>}
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
                {passErr && <span className="error">Password must have 6 characters</span>}
              </div>
              <br />
              <button type="submit" className="btn flexDiv">
                <span>Login</span>
                <AiOutlineSwapRight className="icon" />
              </button>
              <br />
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
