import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

interface Evaluacion {
  id_estudiante: string;
  portafolio_evidencias: string;
  producto: string;
  evaluacion_final: string;
}

interface Seguimiento {
  comentario: string;
  retroalimentacion: string;
}

interface Tutor {
  nombre: string;
  telefono: string;
  correoElectronico: string;
}

const API_URL = "https://modelodual.utpuebla.edu.mx";

const DashboardAlumno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [seguimiento, setSeguimiento] = useState<Seguimiento[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [error, setError] = useState("");
  const [alertas, setAlertas] = useState<{ tipo: string, mensaje: string, id: number, duracion: number }[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const agruparCalificaciones = (datos: Evaluacion[]) => {
    const agrupados: { [id: string]: Evaluacion } = {};

    datos.forEach((item) => {
      const id = item.id_estudiante;

      if (!agrupados[id]) {
        agrupados[id] = { ...item };
      } else {
        agrupados[id].portafolio_evidencias = item.portafolio_evidencias || agrupados[id].portafolio_evidencias;
        agrupados[id].producto = item.producto || agrupados[id].producto;

        const portafolio = parseFloat(agrupados[id].portafolio_evidencias) || 0;
        const producto = parseFloat(agrupados[id].producto) || 0;

        agrupados[id].evaluacion_final = ((portafolio + producto) / 2).toString();
      }
    });

    return Object.values(agrupados);
  };

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const tutorExternoId = localStorage.getItem("userId");
        if (!tutorExternoId) {
          setError("ID del estudiante no encontrado.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/evaluaciones/${tutorExternoId}`);
        setEvaluaciones(response.data);

        const seguimientoResponse = await axios.get<Seguimiento[]>(
          `${API_URL}/seguimiento/${tutorExternoId}`
        );
        setSeguimiento(seguimientoResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Hubo un problema al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluaciones();

    const idAlumno = localStorage.getItem('userId');

    if (idAlumno) {
      fetch(`${API_URL}/mostrar-datos/tutor-interno/${idAlumno}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setSelectedTutor(data);
          }
        })
        .catch(error => console.error('Error al obtener el tutor:', error));
    }

    const obtenerAlertas = async () => {
      try {
        const response = await axios.get(`${API_URL}/obtener_alertas`);
        const alertasConId = response.data.map((alerta: { tipo: string, mensaje: string }, index: number) => ({
          ...alerta,
          id: nextId + index,
          duracion: alerta.tipo === 'Reinscripción' ? 6000 : 5000,
        }));

        setAlertas(prev => [
          ...prev.filter((alerta) =>
            !alertasConId.some((newAlerta: { id: number }) => newAlerta.id === alerta.id)
          ),
          ...alertasConId,
        ]);
        setNextId(nextId + alertasConId.length);
      } catch (error) {
        console.error('Error al obtener las alertas:', error);
      }
    };

    obtenerAlertas();
  }, []);
      

  const handleShowTutor = () => {
    if (selectedTutor) {
      setShowModal(true);
    } else {
      alert("No se encontró ningún tutor asignado.");
    }
  };


  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Establecer temporizadores para cada alerta
    alertas.forEach((alerta) => {
      const timer = setTimeout(() => {
        handleDismiss(alerta.id);
      }, alerta.duracion);
      timers.push(timer);
    });

    // Limpiar los temporizadores cuando las alertas cambian o el componente se desmonte
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [alertas]);

  const handleDismiss = (id: number) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== id));
  };


  const evaluacionesAgrupadas = agruparCalificaciones(evaluaciones);

  const closeModal = () => {
    setShowModal(false);
    
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fdfbfb, #ebedee)',
          padding: '2rem',
        }}
      >
        <div className="content-wrapper p-4 w-100">
          <div className="container-fluid">
            {/* Panel Principal */}
            <div className="card card-primary card-outline shadow mb-4">
              <div className="card-header text-center">
                <h3 className="card-title w-100">Panel del Alumno</h3>
              </div>
              <div className="card-body text-center">
                <p className="lead">Bienvenido al panel del alumno. Aquí puedes ver tus evaluaciones.</p>
  
                {/* Alertas */}
                <div className="mb-4">
                  <h5><i className="fas fa-bell text-warning"></i> Alertas Importantes:</h5>
                  {alertas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className="alert alert-info alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>{alerta.tipo}:</strong> {alerta.mensaje}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => handleDismiss(alerta.id)}
                      ></button>
                    </div>
                  ))}
                </div>
  
                {/* Evaluaciones */}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : evaluacionesAgrupadas.length === 0 ? (
                  <div className="alert alert-warning">No hay evaluaciones registradas.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th>Portafolio de evidencias</th>
                          <th>Producto</th>
                          <th>📊 Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluacionesAgrupadas.map((eva, index) => {
                          const portafolio = parseFloat(eva.portafolio_evidencias) || 0;
                          const producto = parseFloat(eva.producto) || 0;
                          const promedio = (portafolio + producto) / 2;
  
                          return (
                            <tr key={index}>
                              <td>{eva.portafolio_evidencias || <span className="text-muted">N/A</span>}</td>
                              <td>{eva.producto || <span className="text-muted">N/A</span>}</td>
                              <td className="text-success font-weight-bold">{promedio.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
  
                {/* Seguimiento */}
                {seguimiento && (
                  <div className="card card-secondary mt-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Seguimiento</h5>
                    </div>
                    <div className="card-body p-0">
                      <table className="table table-striped table-hover table-bordered mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Tutor</th>
                            <th>Comentario</th>
                            <th>Retroalimentación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {seguimiento.map((item, index) => (
                            <tr key={index}>
                              <td><strong>{index % 2 === 0 ? 'Tutor Interno' : 'Tutor Externo'}</strong></td>
                              <td>{item.comentario}</td>
                              <td>{item.retroalimentacion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
  
            {/* Card de Tutor Interno */}
            <div className="card card-primary mt-4">
              <div className="card-header">
                <h3 className="card-title">Tutor Interno Asignado</h3>
              </div>
              <div className="card-body text-center">
                <button
                  className="btn btn-lg btn-info"
                  onClick={handleShowTutor}
                >
                  <i className="fas fa-chalkboard-teacher mr-3"></i> Mostrar Datos del Tutor Interno
                </button>
              </div>
  
              {/* Modal */}
              {showModal && selectedTutor && (
                <div className="modal fade show d-block" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Datos del Tutor Interno Asignado</h5>
                        <button type="button" className="close text-white" onClick={closeModal}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body text-left">
                        <p><strong> Nombre:</strong> {selectedTutor.nombre}</p>
                        <p><strong> Correo:</strong> {selectedTutor.correoElectronico}</p>
                        <p><strong> Teléfono:</strong> {selectedTutor.telefono}</p>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>      
        </div>
      </div>
    </>
  );
  
};

export default DashboardAlumno;
