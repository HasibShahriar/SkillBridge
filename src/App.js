

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./navigation_bar";


function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/page1" element={<h2>Page 1</h2>} />
        <Route path="/page2" element={<h2>Page 2</h2>} />
        <Route path="/page3" element={<h2>Page 3</h2>} />
        <Route path="/page4" element={<h2>Page 4</h2>} />
        <Route path="/login" element={<h2>Login Page</h2>} />
        <Route path="/register" element={<h2>Register Page</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
