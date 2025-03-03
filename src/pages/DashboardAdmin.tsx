import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardAdmin = ({ setUserRole, setIsAuthenticated }: Props) => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rol, setRol] = useState<string>("Administrador");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = { usuario, password, rol };

    fetch("http://localhost:3000/registrar-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
        alert("Error al registrar usuario");
      });
  };

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
          <h3>Registrar Usuario</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                className="form-control"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                className="form-control"
                name="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="Administrador">Administrador</option>
                <option value="Director">Director</option>
                <option value="TutorInterno">Tutor Interno</option>
                <option value="TutorExterno">Tutor Externo</option>
                <option value="Alumno">Alumno</option>
                <option value="Vinculación">Vinculación</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Registrar Usuario
            </button>
          </form>

          
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardAdmin;
