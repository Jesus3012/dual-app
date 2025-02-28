import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardDirector from "./pages/DashboardDirector";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAlumno from "./pages/DashboardAlumno";
import DashboardTutorInterno from "./pages/DashboardTutorInterno";
import DashboardTutorExterno from "./pages/DashboardTutorExterno";
import DashboardVinculacion from "./pages/DashboardVinculacion";
import Altas from "./pages/Altas";

function App() {
  const [, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Role almacenado:", storedRole); // 🔍 Depuración
    const token = localStorage.getItem("token");
  
    if (storedRole && token) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />

        {isAuthenticated ? (
          <>
            <Route path="/administrador" element={<DashboardAdmin setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/director" element={<DashboardDirector setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/alumno" element={<DashboardAlumno setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/tutorInterno" element={<DashboardTutorInterno setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/tutorExterno" element={<DashboardTutorExterno setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/vinculacion" element={<DashboardVinculacion setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
          
            <Route path="/altas" element={<Altas />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
