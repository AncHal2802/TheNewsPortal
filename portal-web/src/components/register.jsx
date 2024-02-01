import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";
import { CiFaceSmile } from "react-icons/ci";
import "../cStyles/register_login.css";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleName = (e) => {
    let inputValue = e.target.value.replace(/[^a-zA-Z]/gi, "");
    setUser((prevUser) => ({ ...prevUser, name: inputValue }));
  };

  const [unameErr, setUnameErr] = useState(false);
  const unameHandler = (e) => {
    let inputValue = e.target.value;
    setUnameErr(inputValue.trim() === "" || inputValue.length < 3);
    setUser((prevUser) => ({ ...prevUser, username: inputValue }));
  };

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailError, setEmailError] = useState(false);
  const handleEmail = (e) => {
    const inputValue = e.target.value;
    setEmailError(inputValue.trim() !== "" && !emailPattern.test(inputValue));
    setUser((prevUser) => ({ ...prevUser, email: inputValue }));
  };

  const [passErr, setPassErr] = useState(false);
  const passHandler = (e) => {
    let pswd = e.target.value;
    setPassErr(pswd.trim() !== "" && pswd.length < 6);
    setUser((prevUser) => ({ ...prevUser, password: pswd }));
  };

  const [passMatchErr, setPassMatchErr] = useState(false);
  const passMatchHandler = (e) => {
    let rePass = e.target.value;
    setPassMatchErr(rePass.trim() !== "" && rePass !== user.password);
    setUser((prevUser) => ({ ...prevUser, reEnterPassword: rePass }));
  };

  const register = (e) => {
    e.preventDefault();

    const { name, username, email, password, reEnterPassword } = user;

    if (
      name.trim() !== "" &&
      username.trim() !== "" &&
      emailPattern.test(email) &&
      password.length >= 6 &&
      password === reEnterPassword
    ) {
      axios
        .post("http://localhost:3000/register", user)  // Replace with your actual server API endpoint
        .then((res) => {
          alert(res.data.message);
          navigate("/login");
        })
        .catch((error) => {
          console.error("Registration error:", error);
        });
    } else {
      alert("Invalid input");
    }
  };

  return (
    <div className="registerPage flexDiv ">
      <div className="contanier flexDiv">
        <div className="videoDiv">
        <video src='/videos/Video1.mp4' autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title">The News Portal</h2>
            <p>Engage, Explore, Evolve</p>
          </div>
          <div className="footerDiv flexDiv">
            <span className="text">Already have an account?</span>
            <Link to={"/login"}>
              <button className="btn">Sign In</button>
            </Link>
          </div>
        </div>

        <div className="fromDiv scrollDi">
          <div className="headerDiv flex flex-col items-center justify-center overflow-hidden">
          <h1>The News Portal</h1>

            <h3>Let us Know about you!!</h3>
          </div>

          <form onSubmit={register} className="form">
            <div className="inputDiv">
              <label htmlFor="name">Name</label>
              <div className="input flexDiv">
                <CiFaceSmile className="icon" />
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  placeholder="Your Name"
                  onChange={handleName}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flexDiv">
                <FaUserShield className="icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Set Username"
                  value={user.username}
                  onChange={unameHandler}
                />
              </div>
              {unameErr ? <span className="error">Username Not Valid</span> : ""}
            </div>
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flexDiv">
                <MdMarkEmailRead className="icon" />
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  placeholder="Your Email"
                  onChange={handleEmail}
                />
              </div>
              {emailError ? <span className="error">Email Not Valid</span> : ""}
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flexDiv">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="text"
                  name="password"
                  value={user.password}
                  placeholder="Set Password"
                  onChange={passHandler}
                />
              </div>
              {passErr ? (
                <span className="error">Password must have 6 characters </span>
              ) : (
                ""
              )}
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Confirm Password</label>
              <div className="input flexDiv">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="text"
                  name="reEnterPassword"
                  value={user.reEnterPassword}
                  placeholder="Re-enter Password"
                  onChange={passMatchHandler}
                />
              </div>
              {passMatchErr ? <span className="error">Mismatch Password</span> : ""}
            </div>
            <button type="submit" className="btn flexDiv">
              <span>Register</span>
              <AiOutlineSwapRight className="icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
