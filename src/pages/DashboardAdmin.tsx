import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Registrar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="rol">Rol:</label>
        <select name="rol" value={rol} onChange={(e) => setRol(e.target.value)} required>
          <option value="Administrador">Administrador</option>
          <option value="Director">Director</option>
          <option value="TutorInterno">Tutor Interno</option>
          <option value="TutorExterno">Tutor Externo</option>
          <option value="Alumno">Alumno</option>
          <option value="Vinculación">Vinculación</option>
        </select>
        <button type="submit">Registrar Usuario</button>
      </form>

      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default DashboardAdmin;
