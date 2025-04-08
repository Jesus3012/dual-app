import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const API_URL = "http://localhost:3000";

const NuevosDirector = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rol, setRol] = useState<string>("Administrador");

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

  // Por defecto el rol es 'Administrador'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = { usuario, password, rol };

    fetch(`${API_URL}/registrar-usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        // Limpiar los campos del formulario
        setUsuario("");
        setPassword("");
        setRol("Administrador"); // Restablecer el rol por defecto
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
        alert("Error al registrar usuario");
      });
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-12">
                <div className="card card-outline card-primary">
                  <div className="card-header">
                    <h1 className="card-title text-center font-weight-bold">
                      <i className="fas mr-2"></i>
                      NUEVOS USUARIOS
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Registrar Usuario Form */}
          <div className="card shadow-sm border-0 rounded-3 mb-4 mx-auto" style={{ maxWidth: "1000px" }}>
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-0">Registrar Usuario</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      placeholder="Usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
  
                <div className="mb-3">
                  <label htmlFor="rol" className="form-label">
                    Rol:
                  </label>
                  <select
                    name="rol"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Director">Director</option>
                    <option value="Vinculación">Vinculación</option>
                  </select>
                </div>
  
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "250px" }}
                  >
                    Registrar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
  
};

export default NuevosDirector;
