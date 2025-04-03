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


const DashboardAlumno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [seguimiento, setSeguimiento] = useState<Seguimiento[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [altasData, setAltasData] = useState<any[]>([]);
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

        const response = await axios.get(`http://localhost:3000/evaluaciones/${tutorExternoId}`);
        setEvaluaciones(response.data);

        const seguimientoResponse = await axios.get<Seguimiento[]>(
          `http://localhost:3000/seguimiento/${tutorExternoId}`
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

    fetch('http://localhost:3000/mostrar-datos/tutores-internos')
      .then(response => response.json())
      .then(data => setTutors(data))
      .catch(error => console.error('Error al obtener los datos:', error));

      const obtenerAlertas = async () => {
        try {
          const response = await axios.get('http://localhost:3000/obtener_alertas');
          const alertasConId = response.data.map((alerta: { tipo: string, mensaje: string }, index: number) => ({
            ...alerta,
            id: nextId + index,
            duracion: alerta.tipo === 'Reinscripción' ? 6000 : 5000, 
          }));
          
          // Evitar duplicación de alertas
          setAlertas(prev => [
            ...prev.filter((alerta) => !alertasConId.some((newAlerta: { id: number; }) => newAlerta.id === alerta.id)), // Filtramos alertas existentes
            ...alertasConId,
          ]);
          setNextId(nextId + alertasConId.length);
        } catch (error) {
          console.error('Error al obtener las alertas:', error);
        }
      };
  
      obtenerAlertas();
  }, []);

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


  const tutorExternoId = localStorage.getItem("userId");
  useEffect(() => {
    if (tutorExternoId) {
      fetch(`http://localhost:3000/altas/${tutorExternoId}`)
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

  const evaluacionesAgrupadas = agruparCalificaciones(evaluaciones);

  const handleSelect = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTutor(null);
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="card shadow-lg rounded-4">
          <div className="card-header text-center bg-primary text-white rounded-top-4">
            <h3 className="mb-0"> Panel del Alumno</h3>
          </div>
          <div className="card-body text-center p-4">
            <p className="lead">Bienvenido al panel del alumno. Aquí puedes ver tus evaluaciones.</p>

            <div className="container">
              <h4>Alertas Importantes:</h4>
              <div className="alertas">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="alert alert-primary alert-dismissible fade show"
                    role="alert"
                    style={{ transition: 'opacity 0.5s ease' }}
                  >
                    <strong>{alerta.tipo}:</strong> {alerta.mensaje}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => handleDismiss(alerta.id)}
                    ></button>
                  </div>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
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
                <table className="table table-striped table-hover mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th> Portafolio de evidencias</th>
                      <th> Producto</th>
                      <th>📊 Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluacionesAgrupadas.map((eva, index) => {
                      const portafolio = parseFloat(eva.portafolio_evidencias) || 0;
                      const producto = parseFloat(eva.producto) || 0;
                      const promedio = (portafolio + producto) / 2;

                      return (
                        <tr key={index} className="align-middle">
                          <td>{eva.portafolio_evidencias || <span className="text-muted">N/A</span>}</td>
                          <td>{eva.producto || <span className="text-muted">N/A</span>}</td>
                          <td className="fw-bold text-success">{promedio.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {seguimiento && (
              <div className="card mt-4">
                <div className="card-header text-center">
                  <h4 className="card-title mb-0">Seguimiento</h4>
                </div>
                <div className="card-body">
                  <table className="table table-striped table-hover table-bordered table-sm">
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
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Selecciona un Tutor Interno</h2>
              <label htmlFor="tutorSelect" className="block mb-2 font-medium">Elige un Tutor:</label>
              <select
                id="tutorSelect"
                className="form-control mb-4"
                onChange={(e) => {
                  const selected = tutors.find(tutor => tutor.nombre === e.target.value);
                  if (selected) handleSelect(selected);
                }}
              >
                <option value="">-- Selecciona un Tutor --</option>
                {tutors.map((tutor, index) => (
                  <option key={index} value={tutor.nombre}>{tutor.nombre}</option>
                ))}
              </select>

              {showModal && selectedTutor && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Detalles del Tutor</h5>
                        <button type="button" className="close" onClick={closeModal}>&times;</button>
                      </div>
                      <div className="modal-body">
                        <p><strong>Nombre:</strong> {selectedTutor.nombre}</p>
                        <p><strong>Correo:</strong> {selectedTutor.correoElectronico}</p>
                        <p><strong>Teléfono:</strong> {selectedTutor.telefono}</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-lg rounded-lg border-0">
  <div className="card-header text-black">
  <h2 className="card-title font-weight-bold">Datos de la Alta</h2>
  </div>
  <div className="card-body">
    {altasData.length === 0 ? (
      <div className="alert alert-info">
        No hay datos de alta registrados.
      </div>
    ) : (
      <div className="table-responsive mt-3"> {/* Aquí se añadió mt-3 para crear espacio arriba de la tabla */}
        <table className="table table-bordered table-hover table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Puesto de Trabajo</th>
              <th>Área</th>
              <th>Nombre del Puesto</th>
              <th>Objetivo del Puesto</th>
              <th>Actividades / Etapas</th>
              <th>Cuatrimestre</th>
              <th>Asignatura</th>
              <th>Unidad de Aprendizaje</th>
              <th>Resultado de Aprendizaje</th>
            </tr>
          </thead>
          <tbody>
            {altasData.map((alta, index) => (
              <tr key={index} className="align-middle">
                <td>{alta.puesto_trabajo || <span className="text-muted">N/A</span>}</td>
                <td>{alta.area || <span className="text-muted">N/A</span>}</td>
                <td>{alta.nombre_puesto || <span className="text-muted">N/A</span>}</td>
                <td>{alta.objetivo_puesto || <span className="text-muted">N/A</span>}</td>
                <td>{alta.actividades_etapas || <span className="text-muted">N/A</span>}</td>
                <td>{alta.cuatrimestre || <span className="text-muted">N/A</span>}</td>
                <td>{alta.asignatura || <span className="text-muted">N/A</span>}</td>
                <td>{alta.unidad_aprendizaje || <span className="text-muted">N/A</span>}</td>
                <td>{alta.resultado_aprendizaje || <span className="text-muted">N/A</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
