import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Login.css";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const Login = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUserRole(role);
      setIsAuthenticated(true);
      navigate(`/${role}`);
    }
  }, []);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      setUserRole(data.role);
      setIsAuthenticated(true);

      switch (data.role.toLowerCase()) {
        case "administrador":
          navigate("/administrador");
          break;
        case "director":
          navigate("/director");
          break;
        case "alumno":
          navigate("/alumno");
          break;
        case "tutorinterno":
          navigate("/tutorInterno");
          break;
        case "tutorexterno":
          navigate("/tutorExterno");
          break;
        case "vinculacion":
          navigate("/vinculacion");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("Error al conectar con el servidor. Verifica tu conexión.");
    }
  };

  return (
      <div
        className="login-page"
        style={{
          backgroundColor: "#f3e8ff",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "clamp(20px, 5vw, 30px)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <div className="text-center mb-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5d9-kvwwJkXlfGTJKWDgHMespPVSeW0fABA&s"
              alt="Logo"
              className="img-circle elevation-2"
              style={{ width: "120px", height: "120px" }}
            />
            <h3 className="mt-3" style={{ fontWeight: 600, fontSize: "1.5rem" }}>
              Bienvenido a Dual
            </h3>
            <p style={{ color: "#888", fontSize: "0.9rem" }}>Inicia sesión para continuar</p>
          </div>
    
          {error && <div className="alert alert-danger">{error}</div>}
    
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label style={{ fontWeight: 500 }}>Usuario</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-user" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>
            </div>
    
            <div className="form-group">
              <label style={{ fontWeight: 500 }}>Contraseña</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock" />
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
                  </button>
                </div>
              </div>
            </div>
    
            <button
              type="submit"
              className="btn btn-block"
              style={{
                backgroundColor: "#6a1b9a",
                color: "#fff",
                fontWeight: 500,
                borderRadius: "8px",
              }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  
};

export default Login;
