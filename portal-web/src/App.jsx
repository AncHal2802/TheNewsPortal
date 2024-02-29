// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Politics from "./routes/Politics";
import Entertainment from "./routes/Entertainment";
import Business from "./routes/Business"; // Corrected the typo in the import
import Sports from "./routes/Sports";
import TopHeadings from "./routes/TopHeadings";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/reset_password";
import NewsDetails from "./components/NewsDetails";
import Premium from "./components/Premium";
import Admin from "./components/Admin";
import UpdateUser from "./components/UpdateUser";
import Poll from "./components/Poll";


function App() {
  const [user, setLoginUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const logged = window.localStorage.getItem("userLogged");

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // Fetch search results and update the state
    // Example: You can use axios to fetch data from your API
    // axios.get(`your_api_url?q=${query}`).then(response => setSearchResults(response.data));
  };

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        <Route
          path="/"
          element={
            logged === "true" ? <Home /> : <Login setLoginUser={setLoginUser} />
          }
        />
        <Route path="/subscription" element={<Premium />} />
        <Route
          path="/top-heading"
          element={<TopHeadings searchResults={searchResults} />}
        />
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/business" element={<Business />} /> {/* Corrected the typo in the route path */}
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/forgotpassword"  
  element={<ForgotPassword />}
/>
<Route path="/reset-password/:id/:token" element={<ResetPassword />} />

        <Route path="/newsDetails/:index/:title/:urlToImage/:description" element={<NewsDetails />} />
        <Route path="/admin" element={<Admin/>}></Route>
        <Route path="/update/:id" element={<UpdateUser />} />  
       <Route path="/Home" element={<Home/>}/>
     </Routes>
    </div>
  );
}

export default App;
