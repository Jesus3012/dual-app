import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const API_URL = "http://localhost:3000";

interface Empresa {
  id: number;
  nombre_empresa: string;
  direccion: string;
  contacto_nombre: string;
  contacto_puesto: string;
  correo_electronico: string;
  telefono: string;
  pagina_web: string;
  estado_convenio: string;
  fecha_inicio: string;
  fecha_fin: string;
  sector: string;
  tamano_empresa: string;
  ubicacion: string;
}


const DashboardTutorExterno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [openSeguimiento, setOpenSeguimiento] = useState(false);
  const [openEvaluacion, setOpenEvaluacion] = useState(false);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [portafolio_evidencias, setCalificacion] = useState("");  // Inicializa con 0 o el valor que desees
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [editando, setEditando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para controlar el modal
  
  const [vinculaciones, setVinculaciones] = useState<any[]>([]);
  const [estudiante, setEstudiante] = useState<any | null>(null);
  const [modalEstudianteAbierto, setModalEstudianteAbierto] = useState(false);

  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [selectedEncuesta, setSelectedEncuesta] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  interface Estudiante {
    id: number;
    nombre: string;
  }
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/estudiantes")
      .then((response) => response.json())
      .then((data) => setEstudiantes(data))
      .catch((error) => console.error("Error al cargar estudiantes:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleSaveSeguimiento = async () => {
    if (!estudianteSeleccionado || !retroalimentacion.trim() || !comentario.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const tutorExternoId = localStorage.getItem("userId");

    const seguimientoData = {
      estudiante_id: estudianteSeleccionado,
      tutor_externo_id: tutorExternoId,
      retroalimentacion,
      comentario,
    };

    try {
      const response = await fetch("http://localhost:3000/seguimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seguimientoData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en la solicitud");

      alert(data.message);
      setOpenSeguimiento(false);
      setRetroalimentacion("");
      setComentario("");
      setEstudianteSeleccionado("");
    } catch (error) {
      console.error("Error al enviar la retroalimentación:", error);
    }
  };

  const handleSaveEvaluacion = async () => {
    // Validamos que los campos no estén vacíos y que la calificación sea un número válido
    if (!estudianteSeleccionado || !portafolio_evidencias.trim()) {
      alert("Todos los campos son obligatorios y la calificación debe estar entre 0 y 10");
      return;
    }
  
    const tutorExternoId = localStorage.getItem("userId");
  
    const evaluacionData = {
      id_estudiante: estudianteSeleccionado,
      id_tutor_externo: tutorExternoId,
      portafolio_evidencias, // Directamente usamos el valor de calificación como un número
    };
    try {
      const response = await fetch("http://localhost:3000/evaluaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluacionData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en la solicitud");

      alert(data.message);
      setOpenEvaluacion(false);
      setCalificacion("");
      setEstudianteSeleccionado("");
    } catch (error) {
      console.error("Error al enviar la evaluación:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/empresas`)
      .then((res) => setEmpresas(res.data))
      .catch((err) => console.error("Error al obtener empresas:", err));
  }, []);

  const obtenerEmpresa = async () => {
    if (!empresaSeleccionada) return;
    try {
      const res = await axios.get(`${API_URL}/empresaD/${empresaSeleccionada}`);
      setEmpresa(res.data);
      setEditando(false);
      setModalAbierto(true); // Abre el modal
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (empresa) {
      setEmpresa({ ...empresa, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empresa) {
      try {
        await axios.put(`${API_URL}/empresa/${empresa.id}`, empresa);
        alert("Datos actualizados correctamente");
        setEditando(false);
      } catch (error) {
        console.error("Error al actualizar datos:", error);
      }
    }
  };

  useEffect(() => {
    cargarVinculaciones();
  }, []);

  const cargarVinculaciones = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vinculaciones");
      setVinculaciones(res.data);
    } catch (error) {
      console.error("Error al cargar vinculaciones", error);
    }
  };

  const obtenerEstudiante = async (idEstudiante: number) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/estudiantes/${idEstudiante}`);
      setEstudiante(res.data);
      setModalEstudianteAbierto(true);
    } catch (error) {
      console.error("Error al obtener estudiante", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/encuestas")
      .then((response) => response.json())
      .then((data) => setEncuestas(data))
      .catch((error) => console.error("Error al obtener encuestas:", error));
  }, []);

  const handleEncuestaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(event.target.value);
    setSelectedEncuesta(id);
  };

  const handleVerEncuesta = () => {
    if (!selectedEncuesta) {
      alert("Por favor, selecciona una encuesta.");
      return;
    }

    fetch(`http://localhost:3000/preguntas/${selectedEncuesta}`)
      .then((response) => response.json())
      .then((data) => {
        setPreguntas(data);
        setTimeout(() => setModalVisible(true), 0);
      })
      .catch((error) => console.error("Error al obtener preguntas:", error));
  };
  
  const handleSubmitAnswers = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const answers = preguntas.map(pregunta => ({
      id_pregunta: pregunta.id,
      respuesta: formData.get(`answer_${pregunta.id}`)
    }));
  
    const tutorExternoId = localStorage.getItem("userId");
  
    if (!tutorExternoId) {
      alert("Error: No se encontró el ID del tutor.");
      return;
    }
  
    fetch('http://localhost:3000/respuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encuestaId: selectedEncuesta, respuestas: answers, idTutor: tutorExternoId })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => { throw new Error(data.error || 'Error al guardar las respuestas'); });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        setModalVisible(false);
      })
      .catch(error => {
        alert(error.message); // Mostramos el mensaje de error en caso de que el tutor ya haya respondido
        console.error('Error:', error);
      });
  };  

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h3>Panel del Tutor Externo</h3>
          </div>
          <div className="card-body">
            <p className="lead">Bienvenido al panel del tutor externo.</p>
            <p>Aquí podrás gestionar tus actividades y consultar la información relacionada con los estudiantes bajo tu tutoría.</p>
            <button className="btn btn-primary" onClick={() => setOpenSeguimiento(true)}>Seguimiento</button>
            <button className="btn btn-success ml-2" onClick={() => setOpenEvaluacion(true)}>Evaluación</button>
          </div>
        </div>
      </div>

      {/* Modal Seguimiento */}
      {openSeguimiento && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Seguimiento del Alumno</h5>
                <button type="button" className="close" onClick={() => setOpenSeguimiento(false)}>
                  <span>&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Seleccionar Alumno</label>
                  <select
                    className="form-control"
                    value={estudianteSeleccionado}
                    onChange={(e) => setEstudianteSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Retroalimentación</label>
                  <textarea className="form-control" value={retroalimentacion} onChange={(e) => setRetroalimentacion(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Comentario</label>
                  <textarea className="form-control" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setOpenSeguimiento(false)}>Cerrar</button>
                <button className="btn btn-primary" onClick={handleSaveSeguimiento}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Evaluación */}
      {openEvaluacion && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Evaluación del Alumno</h5>
                <button type="button" className="close" onClick={() => setOpenEvaluacion(false)}>
                  <span>&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Seleccionar Alumno</label>
                  <select className="form-control" value={estudianteSeleccionado} onChange={(e) => setEstudianteSeleccionado(e.target.value)}>
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Calificación (Portafolio de Evidencias)</label>
                  <input
                    type="text" // Usamos 'text' para permitir borrar los valores
                    className="form-control"
                    value={portafolio_evidencias}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Si el valor es vacío o dentro del rango de 0 a 10, lo actualizamos
                      if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                        setCalificacion(value); // Establecemos el valor si está dentro del rango o es vacío
                      }
                    }}
                    onBlur={() => {
                      // Si el valor es inválido después de salir del campo, lo restablecemos a 0 o lo validamos
                      if (portafolio_evidencias === "" || isNaN(parseFloat(portafolio_evidencias)) || parseFloat(portafolio_evidencias) < 0 || parseFloat(portafolio_evidencias) > 10) {
                        setCalificacion("0"); // Establecemos 0 como valor predeterminado si es inválido
                      }
                    }}
                    placeholder="Calificación"
                    
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setOpenEvaluacion(false)}>Cerrar</button>
                <button className="btn btn-success" onClick={handleSaveEvaluacion}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
       
       <div className="container mt-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">Información Empresarial</div>
              <div className="card-body">
                <label>Selecciona una empresa:</label>
                <select
                  className="form-control"
                  value={empresaSeleccionada || ""}
                  onChange={(e) => setEmpresaSeleccionada(Number(e.target.value))}
                >
                  <option value="">-- Seleccionar --</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre_empresa}
                    </option>
                  ))}
                </select>

                <button className="btn btn-primary mt-2" onClick={obtenerEmpresa} disabled={!empresaSeleccionada}>
                  Ver Información
                </button>
              </div>
            </div>

            {/* MODAL - Centrado y con mejor diseño */}
      {modalAbierto && empresa && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{empresa.nombre_empresa}</h5>
                <button type="button" className="close text-black" onClick={() => setModalAbierto(false)}>x</button>
              </div>
              {/* Contenido desplazable */}
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {editando ? (
                  <form onSubmit={handleSubmit}>
                    <label>Nombre:</label>
                    <input type="text" name="nombre_empresa" value={empresa.nombre_empresa} onChange={handleChange} className="form-control" />

                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={empresa.direccion} onChange={handleChange} className="form-control" />

                    <label>Contacto:</label>
                    <input type="text" name="contacto_nombre" value={empresa.contacto_nombre} onChange={handleChange} className="form-control" />

                    <label>Puesto:</label>
                    <input type="text" name="contacto_puesto" value={empresa.contacto_puesto} onChange={handleChange} className="form-control" />

                    <label>Correo:</label>
                    <input type="email" name="correo_electronico" value={empresa.correo_electronico} onChange={handleChange} className="form-control" />

                    <label>Teléfono:</label>
                    <input type="text" name="telefono" value={empresa.telefono} onChange={handleChange} className="form-control" />

                    <label>Página Web:</label>
                    <input type="text" name="pagina_web" value={empresa.pagina_web} onChange={handleChange} className="form-control" />

                    <label>Sector:</label>
                    <select
                      name="sector"
                      value={empresa.sector}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="industrial">Industrial</option>
                      <option value="automotriz">Automotriz</option>
                      <option value="tecnológico">Tecnológico</option>
                      <option value="financiero">Financiero</option>
                      <option value="comercial">Comercial</option>
                      <option value="salud">Salud</option>
                      <option value="educativo">Educativo</option>
                      <option value="otro">Otro</option>
                    </select>

                    <label>Tamaño de la empresa:</label>
                    <select
                      name="tamano_empresa"
                      value={empresa.tamano_empresa}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="pequeña">Pequeña</option>
                      <option value="mediana">Mediana</option>
                      <option value="grande">Grande</option>
                    </select>

                    <button type="submit" className="btn btn-success mt-2">Guardar Cambios</button>
                  </form>
                ) : (
                  <div>
                    <p><strong>Dirección:</strong> {empresa.direccion}</p>
                    <p><strong>Contacto:</strong> {empresa.contacto_nombre} ({empresa.contacto_puesto})</p>
                    <p><strong>Correo:</strong> {empresa.correo_electronico}</p>
                    <p><strong>Teléfono:</strong> {empresa.telefono}</p>
                    <p><strong>Página Web:</strong> {empresa.pagina_web}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cerrar</button>
                {!editando && <button className="btn btn-warning" onClick={() => setEditando(true)}>Editar</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-white">Estudiantes Vinculados</div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="bg-secondary text-white">
              <tr>
                
                <th>Nombre Estudiante</th>
                <th>Empresa Vinculada</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {vinculaciones.map((vinc) => (
                <tr key={vinc.id_estudiante}>
                  
                  <td>{vinc.nombre_estudiante}</td>
                  <td>{vinc.nombre_empresa}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => obtenerEstudiante(vinc.id_estudiante)}
                    >
                      Ver Estudiante
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL - Estudiante */}
        {modalEstudianteAbierto && estudiante && (
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">{estudiante.nombre}</h5>
                  <button
                    type="button"
                    className="close text-black"
                    onClick={() => setModalEstudianteAbierto(false)}
                  >
                    x
                  </button>
                </div>
                <div className="modal-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <p><strong>Matrícula:</strong> {estudiante.matricula}</p>
                  <p><strong>Fecha de nacimiento:</strong> {new Date(estudiante.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                  <p><strong>Curp:</strong> {estudiante.curp}</p>
                  <p><strong>Genero:</strong> {estudiante.genero}</p>
                  <p><strong>Seguro social:</strong> {estudiante.seguridadSocial}</p>
                  <p><strong>Status:</strong> {estudiante.status}</p>
                  <p><strong>Cuatrimestre:</strong> {estudiante.cuatrimestre}</p>
                  <p><strong>División:</strong> {estudiante.division}</p>
                  <p><strong>Correo:</strong> {estudiante.correoElectronico}</p>
                  <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setModalEstudianteAbierto(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="container mt-4">
    <div className="card shadow">
      <div className="card-header bg-dark text-white">Encuestas Disponibles</div>
      <div className="card-body">
        <div className="d-flex flex-column gap-2">
          <select className="form-control" onChange={handleEncuestaChange}>
            <option value="">Seleccione una encuesta</option>
            {encuestas.map((encuesta) => (
              <option key={encuesta.id} value={encuesta.id}>
                {encuesta.nombre_encuesta}
              </option>
            ))}
          </select>

          <div>
            <button 
              className="btn btn-primary" 
              onClick={handleVerEncuesta} 
              disabled={!selectedEncuesta}
            >
              Ver preguntas
            </button>
          </div>
        </div>
      </div>
      {/* MODAL ADMINLTE */}
      {modalVisible && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Preguntas de la Encuesta</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto", paddingBottom: "10px" }}>
                {preguntas.length > 0 ? (
                  <form onSubmit={handleSubmitAnswers}>
                    {preguntas.map((pregunta) => (
                      <div className="mb-3" key={pregunta.id}>
                        <label className="form-label">{pregunta.texto_pregunta}</label>
                        <input type="text" name={`answer_${pregunta.id}`} className="form-control" required />
                      </div>
                    ))}
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">
                        Enviar respuestas
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                        Cerrar
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>No hay preguntas disponibles para esta encuesta.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default DashboardTutorExterno;
