import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "../estilos/Login.css"; 


interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const Login = ({ setUserRole, setIsAuthenticated }: Props) => {

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
  
    if (token && role) {
      setUserRole(role);
      setIsAuthenticated(true);
      navigate(`/${role}`); // Redirige al Dashboard correspondiente
    }
  });

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="login-button">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
