// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Politics from "./routes/Politics";
import Entertainment from "./routes/Entertainment";
import Buisness from "./routes/Buisness"; // Corrected the typo in the import
import Sports from "./routes/Sports";
import TopHeadings from "./routes/TopHeadings";
import Login from "./components/login";
import SearchBar from "./components/SearchBar";
import Footer from "./components/footer";
import Register from "./components/register";
import ForgotPassword from "./components/forgortpassword";
import ResetPassword from "./components/reset_password";
import NewsDetails from "./components/NewsDetails";

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
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            logged === "true" ? <Home /> : <Login setLoginUser={setLoginUser} />
          }
        />
        <Route
          path="/top-heading"
          element={<TopHeadings searchResults={searchResults} />}
        />
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/buisness" element={<Buisness />} /> {/* Corrected the typo in the route path */}
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgotpassword"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset_password/:id/:token"
          element={<ResetPassword />}
        />
        <Route path="/newsDetails/:index/:title/:urlToImage/:description" element={<NewsDetails />} />
      </Routes>
    </div>
  );
}

export default App;
