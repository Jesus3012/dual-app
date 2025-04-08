import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardDirector from "./pages/DashboardDirector";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAlumno from "./pages/DashboardAlumno";
import DashboardTutorInterno from "./pages/DashboardTutorInterno";
import DashboardTutorExterno from "./pages/DashboardTutorExterno";
import DashboardVinculacion from "./pages/DashboardVinculacion";

import Alumnos from "./pages-Admin/alumnos";
import Tutores from "./pages-Admin/tutores";

import NuevosDirector from "./pages-Director/Nuevos-Director";
import TutoresDirector from "./pages-Director/Tutores-Director";
import EmpresasDirector from "./pages-Director/Empresas-Director";

import EncuestasTutorE from "./pages-TutorExterno/Encuestas-TutorE";

import EmpresasAlumno from "./pages-Alumno/Empresas-Alumno";

import EncuestasVinculacion from "./pages-Vinculacion/Encuestas-Vinculacion";

function App() {
  const [, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (storedRole && token) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }

    setIsLoading(false); // <- Solo después de checar localStorage
  }, []);

  if (isLoading) return null; // <- Esperar antes de renderizar las rutas

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

            {/* Ruta específica para la sección de administrador */}
            <Route path="/pages-Admin/alumnos" element={<Alumnos setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/pages-Admin/tutores" element={<Tutores setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            
             {/* Ruta específica para la sección de director */}
            <Route path="/pages-Director/Empresas-Director" element={<EmpresasDirector setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/pages-Director/Nuevos-Director" element={<NuevosDirector setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/pages-Director/Tutores-Director" element={<TutoresDirector setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            
             {/* Ruta específica para la sección de Tutor Externo */}
            <Route path="/pages-TutorExterno/Encuestas" element={<EncuestasTutorE setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            
             {/* Ruta específica para la sección de Alumno */}
            <Route path="/pages-Alumno/Empresas-Alumno" element={<EmpresasAlumno setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
            
             {/* Ruta específica para la sección de Vinculacion */}
            <Route path="/pages-Vinculacion/Encuestas-Vinculacion" element={<EncuestasVinculacion setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}


export default App;
