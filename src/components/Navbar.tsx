import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  handleLogout?: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const getMenuItemsByRole = (role: string | null) => {
    switch (role) {
      case "administrador":
        return [
          { path: "/pages-Admin/alumnos", icon: "fas fa-user-graduate", label: "Alumnos" },
          { path: "/pages-Admin/tutores", icon: "fas fa-chalkboard-teacher", label: "Tutores" },
          
        ];
      case "vinculacion":
        return [
          // { path: "/alumnos", icon: "fas fa-user-graduate", label: "Alumnos" },
          { path: "/pages-Vinculacion/Encuestas-Vinculacion", icon: "fas fa-poll", label: "Encuestas" },
        ];
      case "director":
        return [
          { path: "/pages-Director/Empresas-Director", icon: "fas fa-building", label: "Empresas" },
          { path: "/pages-Director/Tutores-Director", icon: "fas fa-chalkboard-teacher", label: "Tutores" },
          { path: "/pages-Director/Nuevos-Director", icon: "fas fa-user", label: "Nuevos usuarios" },
        ];
      case "alumno":
        return [
          // { path: "/perfil", icon: "fas fa-user", label: "Mi Perfil" },
          { path: "/pages-Alumno/Empresas-Alumno", icon: "fas fa-building", label: "Mis Empresas" },
        ];
      case "tutorInterno":
        return [
          
        ];
      case "tutorExterno":
        return [
          // { path: "/mis-practicantes", icon: "fas fa-user-tie", label: "Practicantes" },
          { path: "/pages-TutorExterno/Encuestas", icon: "fas fa-poll", label: "Encuestas" }
        ];
      default:
        return [];
    }
  };
  
  return (
    <div className="wrapper">
  {/* Sidebar */}
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    {/* Logo */}
    <Link to="/" className="brand-link text-center">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5d9-kvwwJkXlfGTJKWDgHMespPVSeW0fABA&s"
        alt="UTP Logo"
        className="brand-image img-circle elevation-3"
      />
      <span className="brand-text font-weight-light">Modelo Dual</span>
    </Link>

    {/* Sidebar */}
    <div className="sidebar">
      {/* User Panel */}
      <div className="user-panel d-flex align-items-center mt-3 pb-3 mb-3 border-bottom">
        <div className="image">
        <img
          src="/public/dist/img/avatar5.png"
          alt="Avatar Profesional"
          className="img-circle elevation-2"
        />
        </div>
        <div className="info">
          <Link to="#" className="d-block text-white">
            Bienvenido, <span className="fw-bold">{role || "Invitado"}</span>
          </Link>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-3">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <i className="nav-icon fas fa-home "></i>
              <p>Inicio</p>
            </Link>
          </li>
          {getMenuItemsByRole(role).map((item, index) => (
            <li className="nav-item" key={index}>
              <Link to={item.path} className="nav-link">
                <i className={`nav-icon ${item.icon}`}></i>
                <p>{item.label}</p>
              </Link>
            </li>
          ))}

          {/* Botón de Cerrar Sesión */}
          <li className="nav-item">
            <Link
              to="#"
              className="nav-link bg-danger text-white"
              onClick={handleLogout}
              style={{ borderRadius: "8px", transition: "0.3s" }}
            >
              <i className="nav-icon fas fa-sign-out-alt"></i>
              <span className="ml-2">Cerrar Sesión</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>

  {/* Navbar */}
  <nav className="main-header navbar navbar-expand navbar-dark bg-gradient-dark">
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" href="#" role="button">
          <i className="fas fa-bars"></i>
        </a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="/" className="nav-link text-light">
          <i className="fas fa-home"></i> Inicio
        </Link>
      </li>
    </ul>
  </nav>
</div>

  );
};

export default Navbar;
