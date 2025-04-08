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
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = { usuario, password, rol };

    fetch("https://modelodual.utpuebla.edu.mx/registrar-usuario", {
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,rgb(166, 166, 166),rgb(236, 217, 231))',
          padding: '2rem',
        }}
      >
        <div
          className="card border-0 shadow-sm"
          style={{
            width: '50%',
            borderRadius: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
          }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#333' }}>Registrar Usuario</h2>
            <p className="text-muted mb-0">Llena los siguientes campos para crear un nuevo usuario</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                type="text"
                id="usuario"
                className="form-control form-control-lg rounded-3"
                placeholder="Ej. juanperez"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control form-control-lg"
                  placeholder="•••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="rol" className="form-label">Rol</label>
              <select
                id="rol"
                className="form-select form-select-lg rounded-3"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Director">Director</option>
                <option value="Vinculación">Vinculación</option>
              </select>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill"
              >
                Registrar Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  
};

export default DashboardAdmin;
