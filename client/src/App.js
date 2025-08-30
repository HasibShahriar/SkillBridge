import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./navigation_bar";

import Courses from "./components/Courses";
import Dashboard from "./components/Dashboard";
import Home from "./components/home";
import Networks from "./components/Networks"; 
import Login from "./login";
import Register from "./register";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/page3" element={<h2>Page 3</h2>} />
        <Route path="/networks" element={<Networks/>} />  
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;