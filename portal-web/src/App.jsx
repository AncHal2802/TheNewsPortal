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
import Polls from "./components/Polls";
import AdminPanel from "./components/AdminPanel";
import AdminComments from "./components/AdminComments";
import AdminPolls from "./components/AdminPolls";
import Footer from "./components/footer";
import AdminRecords from "./components/AdminRecords";
import Trading from "./routes/Trading";
import Crypto from "./routes/Crypto";
import Crime from "./routes/Crime";
import Esports from "./routes/Esports";
import Science from "./routes/Science";
import Health from "./routes/Health";
import Pahadi from "./routes/Pahadi";
import AdminDash from "./components/AdminDash";


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
          path="/admin/*"
          element={<AdminPanel />}
        >
          <Route index element={<h2>Admin Dashboard</h2>} />
          <Route path="adminUser" element={<Admin />} />
          <Route path="adminComment" element={<AdminComments />} />
          <Route path="adminPolls" element={<AdminPolls />} />
          <Route path="adminPolls" element={<AdminRecords/>} />
          <Route path="admindash" element={<AdminDash/>}/>


        </Route>

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
        <Route path="/trading" element={<Trading/>}/>
        <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/crime" element={<Crime />} />
        <Route path="/esports" element={<Esports />} />
        <Route path="/science" element={<Science />} />
        <Route path="/health" element={<Health />} />
        <Route path="/pahadi" element={<Pahadi />} />




        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />



        <Route path="/newsDetails/:index/:title/:urlToImage/:description" element={<NewsDetails />} />
        <Route path="/update/:_id" element={<UpdateUser />} />

        <Route path="/admin" element={<AdminPanel/>}/>
        <Route path="/polls" element={<Polls/>}/>
       
     </Routes>
   
    </div>
  );
}

export default App;
