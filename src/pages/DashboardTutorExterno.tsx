import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardTutorExterno = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [openSeguimiento, setOpenSeguimiento] = useState(false);
  const [openEvaluacion, setOpenEvaluacion] = useState(false);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [portafolio_evidencias, setCalificacion] = useState("");  // Inicializa con 0 o el valor que desees
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState("");

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
    </>
  );
};

export default DashboardTutorExterno;
