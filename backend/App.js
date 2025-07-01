import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Matriculas from "./components/Matriculas";
import Login from "./components/Login";
import Professores from "./components/Professores"; // <-- importar aqui!
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/matriculas"
          element={
            <PrivateRoute>
              <Matriculas />
            </PrivateRoute>
          }
        />

        <Route
          path="/professores"
          element={
            <PrivateRoute>
              <Professores />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
