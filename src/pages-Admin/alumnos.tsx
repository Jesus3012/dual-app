import { useEffect, } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const Alumnos = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirige al login si no hay token
    }
  }, [navigate]);

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <h1>Panel Alumnos</h1> {/* Aquí se muestra solo el mensaje */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Alumnos;
