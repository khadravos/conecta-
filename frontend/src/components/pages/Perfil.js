import React, { useEffect, useState } from "react";
import {Navigate } from "react-router-dom"; 
function Perfil() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); 
    }
  }, []);


  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

    return (

        <h1>Perfil</h1>
        
      );

}

export default Perfil;