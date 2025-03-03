import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardAlumno = ({ setUserRole, setIsAuthenticated }: Props) => {
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
        <div className="card-header text-center">
          <h3>Panel del Alumno</h3>
        </div>
        <div className="card-body text-center">
          <p>Bienvenido al panel del alumno.</p>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardAlumno;
