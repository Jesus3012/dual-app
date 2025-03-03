import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardVinculacion = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>    <Navbar handleLogout={handleLogout} />

    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Panel de Vinculación</h3>
        </div>
        <div className="card-body">
          <p className="lead">Bienvenido al panel de vinculación.</p>
          <p>En este panel podrás gestionar las relaciones con empresas y colaboradores para las prácticas y proyectos de los estudiantes.</p>
        </div>
        <div className="card-footer text-right">
          
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardVinculacion;
