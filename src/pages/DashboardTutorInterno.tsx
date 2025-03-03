import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardTutorInterno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
        <Navbar handleLogout={handleLogout} />

    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Panel del Tutor Interno</h3>
        </div>
        <div className="card-body">
          <p className="lead">Bienvenido al panel del tutor interno.</p>
          <p>En este panel podrás gestionar la información de los estudiantes asignados a tu tutoría.</p>
        </div>
          <button onClick={() => navigate("/altas")} className="menu-button">
            Registrar Alta
          </button>
        <div className="card-footer text-right">
          
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardTutorInterno;
