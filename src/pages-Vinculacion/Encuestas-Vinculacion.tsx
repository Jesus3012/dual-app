import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

interface Respuesta {
  nombre_encuesta: string;
  descripcion: string;
  nombre_Tutor: string;
  texto_pregunta: string;
  respuesta: string;
  fecha_respuesta: string;
}

const EncuestasVinculacion = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [tutores, setTutores] = useState<any[]>([]);
  const [encuestaId, setEncuestaId] = useState<number | string>('');
  const [tutorId, setTutorId] = useState<number | string>('');
  
  const [encuestaData, setEncuestaData] = useState<Respuesta[]>([]);
  
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

  const [nombreEncuesta, setNombreEncuesta] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [preguntas, setPreguntas] = useState<string[]>([]);
    const [nuevaPregunta, setNuevaPregunta] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const agregarPregunta = () => {
      if (nuevaPregunta.trim() !== "") {
        setPreguntas([...preguntas, nuevaPregunta]);
        setNuevaPregunta("");
      }
    };
    const handleSubmitEncuesta = async () => {
      try {
        await axios.post("http://localhost:3000/agregar_encuesta", {
          nombreEncuesta,
          descripcion,
          preguntas,
        });
        alert("Encuesta guardada con éxito");
        setModalVisible(false);
        setNombreEncuesta("");
        setDescripcion("");
        setPreguntas([]);
      } catch (error) {
        console.error("Error al guardar la encuesta:", error);
      }
    };

    useEffect(() => {
        // Cargar encuestas
        fetch('http://localhost:3000/encuestas')
          .then((res) => res.json())
          .then((data) => setEncuestas(data));
    
        // Cargar tutores
        fetch('http://localhost:3000/tutores')
          .then((res) => res.json())
          .then((data) => setTutores(data));
      }, []);
    
      // Función para cargar las respuestas de la encuesta seleccionada
      const fetchEncuestaRespuestas = async () => {
        if (!encuestaId) return;
      
        // Limpia los datos anteriores antes de la nueva consulta
        setEncuestaData([]);
      
        const url = new URL('http://localhost:3000/api/respuestas');
        url.searchParams.append('idEncuesta', String(encuestaId));
      
        if (tutorId) {
          url.searchParams.append('idTutor', String(tutorId));
        }
      
        try {
          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error('Error al obtener las respuestas');
          }
          const data = await response.json();
      
          if (data.length === 0) {
            alert('No hay respuestas para esta encuesta o tutor seleccionado.');
            return;
          }
      
          setEncuestaData(data);
        } catch (error) {
          console.error('Error al cargar las respuestas:', error);
        }
      };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="content-wrapper">
        <section className="content-header">

        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-12">
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h1 className="card-title text-center font-weight-bold">
                    <i className="fas mr-2"></i>
                    ENCUESTAS
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-4">
            <div className="card shadow">
                <h2 className="card-header bg-dark text-white">Gestión de Encuestas</h2>
                <br />
                <button
                className="btn btn-success mx-auto d-block"
                onClick={() => setModalVisible(true)}
                >
                Agregar Encuesta
                </button>
                <br />
            </div>

            {/* Modal para agregar encuestas */}
            {modalVisible && (
                <div className="modal fade show d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header bg-primary">
                        <h5 className="modal-title ">Crear Encuesta</h5>
                        <button
                        type="button"
                        className="btn-close"
                        onClick={() => setModalVisible(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nombre de la encuesta"
                        value={nombreEncuesta}
                        onChange={(e) => setNombreEncuesta(e.target.value)}
                        />
                        <textarea
                        className="form-control mb-2"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        ></textarea>
                        <div className="mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nueva pregunta"
                            value={nuevaPregunta}
                            onChange={(e) => setNuevaPregunta(e.target.value)}
                        />
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={agregarPregunta}
                        >
                            Agregar Pregunta
                        </button>
                        </div>
                        <ul className="list-group">
                        {preguntas.map((pregunta, index) => (
                            <li key={index} className="list-group-item">
                            {pregunta}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button
                        className="btn btn-success"
                        onClick={handleSubmitEncuesta}
                        >
                        Guardar Encuesta
                        </button>
                        <button
                        className="btn btn-danger"
                        onClick={() => setModalVisible(false)}
                        >
                        Cerrar
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            )}

            <div className="container mt-4">
                <div className="card shadow">
                <div className="card-body">
                    <div className="card-header bg-dark text-white">
                    <h2>Selecciona la Encuesta</h2>
                    </div>
                    <select onChange={(e) => setEncuestaId(e.target.value)} value={encuestaId} className="form-control">
                    <option value="">Seleccione una encuesta</option>
                    {encuestas.map((encuesta) => (
                        <option key={encuesta.id} value={encuesta.id}>
                        {encuesta.nombre_encuesta}
                        </option>
                    ))}
                    </select>

                    {encuestaId && (
                    <div className="mt-3">
                        <div className="card-header bg-dark text-white">
                        <h3>Selecciona un Tutor</h3>
                        </div>
                        <select onChange={(e) => setTutorId(e.target.value)} value={tutorId} className="form-control">
                        <option value="">Todos los tutores</option>
                        {tutores.map((tutor) => (
                            <option key={tutor.id} value={tutor.id}>
                            {tutor.nombre_Tutor}
                            </option>
                        ))}
                        </select>
                    </div>
                    )}

                    {/* Botón para abrir el modal */}
                    <button 
                    className="btn btn-primary mt-3" 
                    data-toggle="modal" 
                    data-target="#modalRespuestas"
                    onClick={fetchEncuestaRespuestas}
                    >
                    Ver Respuestas
                    </button>
                </div>
                </div>
            </div>

            {/* Modal con scroll */}
            <div className="modal fade" id="modalRespuestas" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg"> {/* modal-lg para mayor espacio */}
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Respuestas de la Encuesta</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {encuestaData.length > 0 ? (
                        encuestaData.map((respuesta, index) => (
                        <div key={index}>
                            <p><strong>Pregunta:</strong> {respuesta.texto_pregunta}</p> 
                            <p><strong>Respuesta:</strong> {respuesta.respuesta}</p>
                            <hr />
                        </div>
                        ))
                    ) : (
                        <p>No hay respuestas disponibles.</p>
                    )}
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
                </div>
            </div>
            </div>

        </section>
      </div>
    </>
  );
};

export default EncuestasVinculacion;
