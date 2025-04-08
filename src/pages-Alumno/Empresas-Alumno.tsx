import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const API_URL = "http://localhost:3000";

const EmpresasAlumno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [altasData, setAltasData] = useState<any[]>([]);
  const [, setError] = useState("");
  
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

   const tutorExternoId = localStorage.getItem("userId");
    useEffect(() => {
      if (tutorExternoId) {
        fetch(`${API_URL}/altas/${tutorExternoId}`)
          .then((response) => response.json())
          .then((data) => setAltasData(data))
          .catch((error) => {
            setError("Error al cargar los datos de la alta.");
            console.error("Error:", error);
          });
      } else {
        setError("No se encontró el ID del estudiante.");
      }
    }, [tutorExternoId]);

    const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      const idAlumno = localStorage.getItem("userId");
      if (!idAlumno) return;

      try {
        const response = await fetch(`${API_URL}/api/empresa-vinculada?idAlumno=${idAlumno}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la empresa');
        }

        const data = await response.json();
        setEmpresa(data);
      } catch (error) {
        console.error('Error al obtener la empresa vinculada:', error);
      }
    };

    fetchEmpresa();
  }, []);

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="content-wrapper">
        <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-12">
              <div className="card card-outline card-secondary">
                <div className="card-header">
                  <h1 className="card-title text-center  font-weight-bold">
                    <i className="fas mr-2"></i>
                    EMPRESAS
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Datos de Alta */}
        <div className="card card-success card-outline mt-4 shadow">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user-tie me-2"></i>Información del Alta
              </h5>
            </div>

            <div className="card-body">
              {altasData.length === 0 ? (
                <div className="alert alert-info text-center">
                  <i className="fas fa-info-circle me-2"></i>No hay datos de alta registrados.
                </div>
              ) : (
                <div className="row">
                  {altasData.map((alta, index) => (
                    <div key={index} className="col-12 mb-4">
                      <div className="card bg-light border-success shadow-sm">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <p><strong><i className="fas fa-briefcase me-2"></i>Puesto de Trabajo:</strong><br />{alta.puesto_trabajo || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-id-badge me-2"></i>Nombre del Puesto:</strong><br />{alta.nombre_puesto || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-layer-group me-2"></i>Cuatrimestre:</strong><br />{alta.cuatrimestre || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-book me-2"></i>Asignatura:</strong><br />{alta.asignatura || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-book-open me-2"></i>Unidad de Aprendizaje:</strong><br />{alta.unidad_aprendizaje || <span className="text-muted">N/A</span>}</p>
                            </div>

                            <div className="col-md-6">
                              <p><strong><i className="fas fa-sitemap me-2"></i>Área:</strong><br />{alta.area || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-bullseye me-2"></i>Objetivo del Puesto:</strong><br />{alta.objetivo_puesto || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-tasks me-2"></i>Actividades / Etapas:</strong><br />{alta.actividades_etapas || <span className="text-muted">N/A</span>}</p>
                              <p><strong><i className="fas fa-lightbulb me-2"></i>Resultado de Aprendizaje:</strong><br />{alta.resultado_aprendizaje || <span className="text-muted">N/A</span>}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card card-primary card-outline mt-4 shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title"><i className="fas fa-building me-2"></i>Información de la Empresa Vinculada</h3>
            </div>

            <div className="card-body">
              {empresa ? (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-industry text-primary me-2"></i><strong>Nombre:</strong> {empresa.nombre_empresa}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i><strong>Dirección:</strong> {empresa.direccion}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-user text-primary me-2"></i><strong>Contacto:</strong> {empresa.contacto_nombre}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-briefcase text-primary me-2"></i><strong>Puesto del Contacto:</strong> {empresa.contacto_puesto}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-envelope text-primary me-2"></i><strong>Correo Electrónico:</strong> {empresa.correo_electronico}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-phone text-primary me-2"></i><strong>Teléfono:</strong> {empresa.telefono || 'No disponible'}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-globe text-primary me-2"></i><strong>Página Web:</strong> {empresa.pagina_web || 'No disponible'}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-file-contract text-primary me-2"></i><strong>Estado del Convenio:</strong> {empresa.estado_convenio}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-calendar-alt text-primary me-2"></i><strong>Fecha de Inicio:</strong> {empresa.fecha_inicio}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-calendar-check text-primary me-2"></i><strong>Fecha de Fin:</strong> {empresa.fecha_fin}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-network-wired text-primary me-2"></i><strong>Sector:</strong> {empresa.sector}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-layer-group text-primary me-2"></i><strong>Tamaño de Empresa:</strong> {empresa.tamano_empresa}
                  </div>
                  <div className="col-md-6 mb-3">
                    <i className="fas fa-map-pin text-primary me-2"></i><strong>Ubicación:</strong> {empresa.ubicacion}
                  </div>
                </div>
              ) : (
                <div className="alert alert-info text-center">
                  <i className="fas fa-info-circle me-2"></i>No se encontró información de empresa vinculada.
                </div>
              )}
            </div>
          </div>

        </section>
      </div>
    </>
  );
};

export default EmpresasAlumno;
