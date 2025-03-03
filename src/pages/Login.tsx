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
      navigate(`/${role}`); // Redirige al Dashboard correspondiente
    }
  }, []);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setUserRole(data.role);
      setIsAuthenticated(true);

      switch (data.role) {
        case "administrador":
          navigate("/administrador");
          break;
        case "director":
          navigate("/director");
          break;
        case "alumno":
          navigate("/alumno");
          break;
        case "tutorInterno":
          navigate("/tutorInterno");
          break;
        case "tutorExterno":
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
      setError("Error en el servidor");
    }
  };

  return (
    
    <div className="login-page">
      {/* Contenedor del video de fondo */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source
            src="https://cdn.pixabay.com/video/2022/12/14/142931-781314466_large.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta la etiqueta de video.
        </video>
      </div>

      {/* Caja de Login */}
      <div className="login-box">
        <div className="card">
          <div className="card-header text-center">
            <h3 className="login-title">Iniciar Sesión</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
