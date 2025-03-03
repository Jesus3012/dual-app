import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardTutorExterno = ({ setUserRole, setIsAuthenticated }: Props) => {
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
          <h3>Panel del Tutor Externo</h3>
        </div>
        <div className="card-body">
          <p className="lead">Bienvenido al panel del tutor externo.</p>
          <p>Aquí podrás gestionar tus actividades y consultar la información relacionada con los estudiantes bajo tu tutoría.</p>
        </div>
          
        <div className="card-footer text-right">
          
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardTutorExterno;
