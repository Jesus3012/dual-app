import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  handleLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  return (
    <div className="wrapper">
      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              {/* Logo de la UTP */}
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fes-es.facebook.com%2FOficialUTP%2Fphotos%2Fvisita-wwwutpueblaedumxorgulloutp-castores%2F1844393322516776%2F&psig=AOvVaw2akrECAsIdSuupNew6CgMg&ust=1740787839040000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMishJqK5YsDFQAAAAAdAAAAABAE"
                className="img-circle elevation-2"
                alt="User"
                style={{ width: "40px", height: "40px" }} // Tamaño ajustado
              />
            </div>
            <div className="info">
              {/* Mostrar solo Bienvenido */}
              <Link to="#" className="d-block">
                Bienvenido
              </Link>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon fas fa-home" />
                  <p>Inicio</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/estudiantes" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>Estudiantes</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/empresas" className="nav-link">
                  <i className="nav-icon fas fa-building" />
                  <p>Empresas</p>
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger w-100">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">
              Inicio
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
