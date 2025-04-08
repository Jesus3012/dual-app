import { useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const API_URL = "https://modelodual.utpuebla.edu.mx";

const EncuestasTutorE = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
   const [encuestas, setEncuestas] = useState<any[]>([]);
   const [preguntas, setPreguntas] = useState<any[]>([]);
   const [selectedEncuesta, setSelectedEncuesta] = useState<number | null>(null);
   const [modalVisible, setModalVisible] = useState(false);
  
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

  useEffect(() => {
    fetch(`${API_URL}/encuestas`)
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

    fetch(`${API_URL}/preguntas/${selectedEncuesta}`)
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
  
    fetch(`${API_URL}/respuestas`, {
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
      <div className="content-wrapper">
        <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-12">
              <div className="card card-outline card-secondary">
                <div className="card-header">
                  <h1 className="card-title text-center  font-weight-bold">
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

        </section>
      </div>
    </>
  );
};

export default EncuestasTutorE;
