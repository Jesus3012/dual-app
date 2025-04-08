import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const API_URL = "https://modelodual.utpuebla.edu.mx";

const DashboardTutorInterno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();

  const [alumnoAsignado, setAlumnoAsignado] = useState<{ id: number, nombre: string } | null>(null);
  const [, setAlumnoAsignadoEvaluacion] = useState<{ id: number, nombre: string } | null>(null);

  const [open, setOpen] = useState(false);
  const [openEvaluacion, setOpenEvaluacion] = useState(false);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [producto, setProducto] = useState("");  // Para la evaluación
  const [comentario, setComentario] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState("");
  const [formData, setFormData] = useState({
    puestoTrabajo: "",
    area: "",
    nombrePuesto: "",
    objetivoPuesto: "",
    actividadesEtapas: "",
    cuatrimestre: "",
    asignatura: "",
    unidadAprendizaje: "",
    resultadoAprendizaje: "",
    estudianteAId: "",
  });
  const [showModal, setShowModal] = useState(false);


  interface Estudiante {
    id: number;
    nombre: string;
  }
  
  const [, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
      fetch(`${API_URL}/estudiantes`)
        .then((response) => response.json())
        .then((data) => setEstudiantes(data))
        .catch((error) => console.error("Error al cargar estudiantes:", error));
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
    
      if (name === "cuatrimestre") {
        const cuatrimestreValue = parseInt(value, 10);
    
        // Si el valor es un número dentro del rango de 1 a 11, se actualiza el estado
        if (!isNaN(cuatrimestreValue) && cuatrimestreValue >= 1 && cuatrimestreValue <= 11) {
          setFormData({
            ...formData,
            [name]: value,
          });
        } else if (value === "") {
          // Permitir el campo vacío (si el usuario borra el valor)
          setFormData({
            ...formData,
            [name]: "",
          });
        } else {
          // Si no es un número válido, mostramos un mensaje o ignoramos la entrada
          alert("El cuatrimestre debe estar entre 1 y 11.");
        }
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    };
    
    
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchAlumnoAsignado = async () => {
      const utpDirectorId = localStorage.getItem("userId");
      if (!utpDirectorId) return;
  
      try {
        const response = await fetch(`${API_URL}/utp_director/${utpDirectorId}/alumno`);
        const data = await response.json();
  
        if (response.ok) {
          setAlumnoAsignado(data);
          setEstudianteSeleccionado(data.id); // para enviar al guardar
        } else {
          console.error("Error al obtener alumno asignado:", data.error);
        }
      } catch (error) {
        console.error("Error al cargar alumno:", error);
      }
    };
  
    fetchAlumnoAsignado();
  }, []);
  
  const handleSave = async () => {
    if (!estudianteSeleccionado || !retroalimentacion.trim() || !comentario.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const tutorInternoId = localStorage.getItem("userId");
    

    const seguimientoData = {
      estudiante_id: estudianteSeleccionado,
      utp_director_id: tutorInternoId,
      retroalimentacion,
      comentario,
    };
    try {
      const response = await fetch(`${API_URL}/seguimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seguimientoData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en la solicitud");
      alert(data.message);
      setOpen(false);
      setRetroalimentacion("");
      setComentario("");
      setEstudianteSeleccionado("");
    } catch (error) {
      console.error("Error al enviar la retroalimentación:", error);
    }
  };
 
  useEffect(() => {
    const fetchAlumnoAsignado = async () => {
      const utpDirectorId = localStorage.getItem("userId");
      if (!utpDirectorId) return;

      try {
        const response = await fetch(`${API_URL}/utp_director/${utpDirectorId}/alumno`);
        const data = await response.json();

        if (response.ok) {
          setAlumnoAsignadoEvaluacion(data);
          setEstudianteSeleccionado(data.id); // importante para guardar evaluación
        } else {
          console.error("Error al obtener alumno asignado:", data.error);
        }
      } catch (error) {
        console.error("Error al cargar alumno:", error);
      }
    };

    fetchAlumnoAsignado();
  }, []);

  const handleSaveEvaluacion = async () => {
    if ( !producto.trim()) {
      alert("Todos los campos de la evaluación son obligatorios");
      return;
    }

    const tutorInternoId = localStorage.getItem("userId");

    const evaluacionData = {
      id_estudiante: estudianteSeleccionado,
      id_tutor_interno: tutorInternoId,
      producto,
    };

    try {
      const response = await fetch(`${API_URL}/evaluaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluacionData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en la solicitud");
      alert(data.message);
      setOpenEvaluacion(false);
      setProducto("");  // Limpiar el campo de producto
    } catch (error) {
      console.error("Error al enviar la evaluación:", error);
    }
  };

  const tutorInternoId = localStorage.getItem("userId");
  const [, setAlumnoAsignadoAlta] = useState<{ id: number; nombre: string } | null>(null);

  useEffect(() => {
    // Llama al nuevo endpoint
    fetch(`${API_URL}/utp_director/${tutorInternoId}/alumno`)
      .then((res) => res.json())
      .then((data) => {
        setAlumnoAsignadoAlta(data); // data tiene { id, nombre }
      })
      .catch((error) => {
        console.error("Error al obtener el alumno asignado:", error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const datosAlta = {
      ...formData,
      estudianteAId: alumnoAsignado?.id, // Usamos el ID obtenido
    };

    fetch(`${API_URL}/registrar-alta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosAlta),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Alta registrada correctamente");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al registrar la alta:", error);
      });
  };

  return (
    <>
  <Navbar handleLogout={handleLogout} />
  <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fdfbfb, #ebedee)',
          padding: '2rem',
        }}
      >
  <div className="container mt-5">
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h3>Panel del Tutor Interno</h3>
      </div>
      <div className="card-body">
        <p className="lead">Bienvenido al panel del tutor interno.</p>
        <p>En este panel podrás gestionar la información de los estudiantes asignados a tu tutoría.</p>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus mr-2"></i> Registrar Alta
        </button>

        <button className="btn btn-primary ml-2" onClick={() => setOpen(true)}>
          <i className="fas fa-tasks mr-2"></i> Seguimiento de Avance
        </button>

        <button className="btn btn-info ml-2" onClick={() => setOpenEvaluacion(true)}>
          <i className="fas fa-clipboard-list mr-2"></i> Registrar Evaluación
        </button>
      </div>
      <div className="card-footer text-right"></div>
    </div>
  </div>
  <div>
  {/* Modal de formulario */}
  {showModal && (
  <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header bg-dark text-white">
          <h5 className="modal-title">
            <i className="fas fa-user-plus me-2"></i>Registrar Alta de Alumno
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Alumno asignado</label>
              <input
                type="text"
                className="form-control"
                value={alumnoAsignado ? alumnoAsignado.nombre : "Cargando..."}
                disabled
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Puesto de Trabajo</label>
                <input
                  type="text"
                  name="puestoTrabajo"
                  className="form-control"
                  value={formData.puestoTrabajo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Área</label>
                <input
                  type="text"
                  name="area"
                  className="form-control"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre del Puesto</label>
                <input
                  type="text"
                  name="nombrePuesto"
                  className="form-control"
                  value={formData.nombrePuesto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Objetivo del Puesto</label>
                <input
                  type="text"
                  name="objetivoPuesto"
                  className="form-control"
                  value={formData.objetivoPuesto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Actividades / Etapas</label>
                <input
                  type="text"
                  name="actividadesEtapas"
                  className="form-control"
                  value={formData.actividadesEtapas}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Cuatrimestre</label>
                <input
                  type="number"
                  name="cuatrimestre"
                  className="form-control"
                  value={formData.cuatrimestre}
                  onChange={handleChange}
                  min="1"
                  max="11"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Asignatura</label>
                <input
                  type="text"
                  name="asignatura"
                  className="form-control"
                  value={formData.asignatura}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Unidad de Aprendizaje</label>
                <input
                  type="text"
                  name="unidadAprendizaje"
                  className="form-control"
                  value={formData.unidadAprendizaje}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Resultado de Aprendizaje</label>
                <input
                  type="text"
                  name="resultadoAprendizaje"
                  className="form-control"
                  value={formData.resultadoAprendizaje}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-check-circle me-2"></i>Registrar Alta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
</div>

  {open && (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Seguimiento de Avance</h5>
            <button type="button" className="close" onClick={() => setOpen(false)}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Alumno Asignado</label>
              <input
                type="text"
                className="form-control"
                value={alumnoAsignado?.nombre || "Cargando..."}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Retroalimentación de avance</label>
              <textarea
                className="form-control"
                value={retroalimentacion}
                onChange={(e) => setRetroalimentacion(e.target.value)}
                placeholder="Ingrese la retroalimentación"
              />
            </div>
            <div className="form-group">
              <label>Comentario</label>
              <textarea
                className="form-control"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ingrese un comentario"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cerrar</button>
            <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )}

  {openEvaluacion && (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className=" modal-title">Registrar Evaluación</h5>
            <button type="button" className="close" onClick={() => setOpenEvaluacion(false)}>
              <span>&times;</span>
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Alumno Asignado</label>
              <input
                type="text"
                className="form-control"
                value={alumnoAsignado?.nombre || "Cargando..."}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Calificacion (Producto de la Evaluación)</label>
              <input
                type="text" // Usamos 'text' para permitir borrar los valores
                className="form-control"
                value={producto}
                onChange={(e) => {
                  const value = e.target.value;
                  // Si es vacío, dejamos el valor vacío
                  if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                    setProducto(value); // Establecemos el valor si está dentro del rango o es vacío
                  }
                }}
                onBlur={() => {
                  // Si el valor es inválido después de salir del campo, lo restablecemos a 0 o lo validamos
                  if (producto === "" || isNaN(parseFloat(producto)) || parseFloat(producto) < 0 || parseFloat(producto) > 10) {
                    setProducto("0"); // Establecemos 0 como valor predeterminado si es inválido
                  }
                }}
                placeholder="Producto"
                
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setOpenEvaluacion(false)}>Cerrar</button>
            <button className="btn btn-info" onClick={handleSaveEvaluacion}>Guardar Evaluación</button>
          </div>
        </div>
      </div>
    </div> 
  )}
  </div>
</>

  );
};

export default DashboardTutorInterno;
