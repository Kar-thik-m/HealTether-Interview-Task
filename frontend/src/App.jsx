import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./ContextApi/AuthContext";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import Update from "./Update/Update";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            index
            path="/"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
