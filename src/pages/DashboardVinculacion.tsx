import { useNavigate } from "react-router-dom";

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
      <div>
        <h1>Panel de Vinculacion</h1>
        <p>Bienvenido al panel de vinculacion.</p>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    );
  };
  
  export default DashboardVinculacion;
  