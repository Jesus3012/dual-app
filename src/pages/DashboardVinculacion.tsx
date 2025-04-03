import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import React from "react";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

interface Estudiante {
  carnet: string;
  id: number;
  matricula: string;
  nombre: string;
  correo_electronico: string;
  correoElectronico: string;
  telefono: string;
  fechaNacimiento?: string;
  curp?: string;
  genero?: string;
  division?: string;
  programaEstudios?: string;
  seguridadSocial?: string;
  status?: string;
  cuatrimestre?: number;
  usuario?: string,
  password?: string,
  rol?:"alumno",
  
}

interface empresa {
  id: number;
  empresa_nombre: string;
}

interface Respuesta {
  nombre_encuesta: string;
  descripcion: string;
  nombre_Tutor: string;
  texto_pregunta: string;
  respuesta: string;
  fecha_respuesta: string;
}

const DashboardVinculacion = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [acta, setActa] = useState<File | null>(null);
  const [nombramiento, setNombramiento] = useState<File | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [convenio, setConvenio] = useState<File | null>(null);
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [tutores, setTutores] = useState<any[]>([]);
  const [encuestaId, setEncuestaId] = useState<number | string>('');
  const [tutorId, setTutorId] = useState<number | string>('');

  const [encuestaData, setEncuestaData] = useState<Respuesta[]>([]);

  

  // Manejo de cambios de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setter(file);
  };

  const [formData, setFormData] = useState({
    nombre_empresa: "",
    direccion: "",
    contacto_nombre: "",
    contacto_puesto: "",
    correo_electronico: "",
    telefono: "",
    pagina_web: "",
    estado_convenio: "activo",
    fecha_inicio: "",
    fecha_fin: "",
    sector: "industrial", // Valor predeterminado
    tamano_empresa: "pequeña",
    ubicacion: "",
  });

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [error] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carnetFile, setCarnetFile] = useState<File | null>(null);

  const abrirModal = (est: Estudiante) => {
    setEstudianteSeleccionado(est);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEstudianteSeleccionado(null);
    setCarnetFile(null);
  };
  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  const obtenerEstudiantes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/estudiantes");
      setEstudiantes(response.data);
    } catch (err) {
      console.error("Error al obtener estudiantes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/registrar-vinculacion", formData);
      if (response.status === 201) {
        alert("Vinculación registrada correctamente.");
        setFormData({
          nombre_empresa: "",
          direccion: "",
          contacto_nombre: "",
          contacto_puesto: "",
          correo_electronico: "",
          telefono: "",
          pagina_web: "",
          estado_convenio: "",
          fecha_inicio: "",
          fecha_fin: "",
          sector: "",
          tamano_empresa: "",
          ubicacion: ""
        });
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("Faltan datos o hay un error en la validación.");
      } else if (err.response?.status === 409) {
        alert("La empresa ya está registrada.");
      } else {
        alert("Error en el servidor.");
      }
    }
  };
  
  //const eliminarEstudiante = async (id: number) => {
//  if (window.confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
//   try {
//     await axios.delete(`http://localhost:3000/estudiantes/${id}`);
//      alert("Estudiante eliminado correctamente.");
//      obtenerEstudiantes(); // Actualiza la lista
//   } catch (err) {
//     console.error("Error al eliminar estudiante:", err);
//     alert("Ocurrió un error al eliminar el estudiante.");
//   }
// }
// };
    const [empresas, setEmpresas] = useState<empresa[]>([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  
    // Cargar la lista de empresas al montar el componente
    useEffect(() => {
      const obtenerEmpresas = async () => {
        try {
          const response = await axios.get('http://localhost:3000/obtener_empresas');
          setEmpresas(response.data);
        } catch (error) {
          console.error('Error al obtener empresas:', error);
        }
      };
      obtenerEmpresas();
    }, []);

  const handleSubmitF = async () => {
    const formData = new FormData();
    formData.append('empresaNombre', empresaNombre);
  
    // Solo agrega el archivo si está presente
    if (acta) formData.append('acta', acta);
    if (nombramiento) formData.append('nombramiento', nombramiento);
    if (comprobante) formData.append('comprobante', comprobante);
    if (convenio) formData.append('convenio', convenio);
  
    try {
      const response = await axios.post('http://localhost:3000/subir_documentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Mostrar mensaje de éxito
      alert("Documentos guardados con éxito");
      console.log('Respuesta del servidor:', response.data);
  
      // Limpiar los campos
      setEmpresaNombre('');
      setActa(null);
      setNombramiento(null);
      setComprobante(null);
      setConvenio(null);
      
    } catch (error) {
      console.error('Error al subir documentos:', error);
      alert("Error al subir los documentos. Inténtalo de nuevo.");
    }
  };
  
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

    const handleDownloadConvenio = async (empresaNombre: string) => {
      try {
        const response = await axios.get(`http://localhost:3000/descargar_convenio/${empresaNombre}`, {
          responseType: 'blob', // Para recibir el archivo binario
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${empresaNombre}_convenio.pdf`); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } catch (error) {
        console.error('Error al descargar el convenio:', error);
      }
    };

     // Función para manejar el cambio del archivo carnet
     const manejarCarnetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) {
        console.error("No se seleccionó ningún archivo");
        return;
      }
    
      setCarnetFile(event.target.files[0]); // Guarda el archivo seleccionado
    };
    
  // Función para subir el carnet al servidor
  const subirCarnet = async (idEstudiante: number) => {
    // Verificar que se haya seleccionado un archivo
    if (!carnetFile) {
      alert('Por favor selecciona un archivo');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('carnet', carnetFile);
  
      // Realizar la solicitud para subir el carnet al servidor
      const response = await fetch(`http://localhost:3000/upload-carnet/${idEstudiante}`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Carnet subido correctamente');
        console.log(data);
        cerrarModal();
      } else {
        alert('Error al subir el carnet');
      }
    } catch (error) {
      console.error('Error en la subida del carnet:', error);
      alert('Hubo un problema al subir el carnet');
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
      <div className="container mt-5">
        <div className="card shadow-lg rounded-lg">
          <div className="card-header bg-primary text-white">
            <h3>Panel de Vinculación</h3>
          </div>
          <div className="card-body">
            <p className="lead">Bienvenido al panel de vinculación.</p>
            <p>En este panel podrás gestionar las relaciones con empresas y colaboradores para las prácticas y proyectos de los estudiantes.</p>
          </div>
        </div>
        <div className="card-header bg-primary text-white">
        <h3>Registrar Vinculación</h3>
        </div>
        <div className="card-body bg-white shadow-lg rounded-lg p-4">
          <p className="lead text-center">Por favor, complete el formulario para registrar la vinculación con la empresa.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Contenedor para los campos */}
              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Nombre de la Empresa</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa el nombre de la empresa"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Dirección de la empresa"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Nombre de Contacto</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="contacto_nombre"
                    value={formData.contacto_nombre}
                    onChange={handleChange}
                    required
                    placeholder="Nombre del contacto"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Puesto de Contacto</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="contacto_puesto"
                    value={formData.contacto_puesto}
                    onChange={handleChange}
                    required
                    placeholder="Puesto del contacto"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="correo_electronico"
                    value={formData.correo_electronico}
                    onChange={handleChange}
                    required
                    placeholder="Correo electrónico de contacto"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Página Web</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="pagina_web"
                    value={formData.pagina_web}
                    onChange={handleChange}
                    placeholder="URL de la página web"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Estado del Convenio</label>
                  <select
                    className="form-control form-control-lg"
                    name="estado_convenio"
                    value={formData.estado_convenio}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="renovado">Renovado</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Sector</label>
                  <select
                    className="form-control form-control-lg"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
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
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Tamaño de la Empresa</label>
                  <select
                    className="form-control form-control-lg"
                    name="tamano_empresa"
                    value={formData.tamano_empresa}
                    onChange={handleChange}
                  >
                    <option value="pequeña">Pequeña</option>
                    <option value="mediana">Mediana</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                    placeholder="Ubicación de la empresa"
                  />
                </div>
              </div>
            </div>

            <div className="form-group mt-4 text-center">
              <button
                type="submit"
                className="btn btn-lg btn-success w-50 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                Registrar Vinculación
              </button>
            </div>
          </form>
        </div>

        <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">Lista de Estudiantes</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => (
                  <tr key={est.id}>
                    <td>{est.matricula}</td>
                    <td>{est.nombre}</td>
                    <td>
                      <button className="btn btn-info btn-sm" onClick={() => abrirModal(est)}>
                        <i className="fas fa-eye"></i> Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal centrado */}
      {mostrarModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Estudiante</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {estudianteSeleccionado && (
                  <ul className="list-group">
                    <li className="list-group-item"><strong>Matrícula:</strong> {estudianteSeleccionado.matricula}</li>
                    <li className="list-group-item"><strong>Nombre:</strong> {estudianteSeleccionado.nombre}</li>
                    <li className="list-group-item"><strong>Fecha de Nacimiento:</strong> {estudianteSeleccionado.fechaNacimiento ? new Date(estudianteSeleccionado.fechaNacimiento).toLocaleDateString("es-ES") : "N/A"}</li>
                    <li className="list-group-item"><strong>CURP:</strong> {estudianteSeleccionado.curp || "N/A"}</li>
                    <li className="list-group-item"><strong>Género:</strong> {estudianteSeleccionado.genero || "N/A"}</li>
                    <li className="list-group-item"><strong>División:</strong> {estudianteSeleccionado.division || "N/A"}</li>
                    <li className="list-group-item"><strong>Programa de Estudios:</strong> {estudianteSeleccionado.programaEstudios || "N/A"}</li>
                    <li className="list-group-item"><strong>Seguridad Social:</strong> {estudianteSeleccionado.seguridadSocial || "N/A"}</li>
                    <li className="list-group-item"><strong>Status:</strong> {estudianteSeleccionado.status || "N/A"}</li>
                    <li className="list-group-item"><strong>Cuatrimestre:</strong> {estudianteSeleccionado.cuatrimestre || "N/A"}</li>
                    <li className="list-group-item"><strong>Correo Electrónico:</strong> {estudianteSeleccionado.correoElectronico}</li>
                    <li className="list-group-item"><strong>Teléfono:</strong> {estudianteSeleccionado.telefono}</li>
                    {/* Otros datos del estudiante */}
                    <li className="list-group-item">
                      <strong>Carnet:</strong>
                      {estudianteSeleccionado.carnet ? (
                        <a href={estudianteSeleccionado.carnet} target="_blank" rel="noopener noreferrer">
                          Ver carnet
                        </a>
                      ) : (
                        <div>
                          <input type="file" onChange={manejarCarnetChange} />
                          <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => subirCarnet(estudianteSeleccionado.id)}
                          >
                            Subir Carnet
                          </button>
                        </div>
                      )}
                    </li>
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

<div className="container mt-4">
  <div className="card shadow">
    <h3 className="card-header bg-dark text-white">Cargar documentos de empresa</h3>
  
  <div className="card-body">
    <div className="form-group">
      <label htmlFor="empresaNombre">Nombre de la empresa</label>
      <input
        type="text"
        className="form-control"
        id="empresaNombre"
        placeholder="Nombre de la empresa"
        value={empresaNombre}
        onChange={(e) => setEmpresaNombre(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label htmlFor="acta">Acta Constitutiva</label>
      <input
        type="file"
        className="form-control-file"
        id="acta"
        onChange={(e) => handleFileChange(e, setActa)}
      />
    </div>

    <div className="form-group">
      <label htmlFor="nombramiento">Nombramiento del representante legal</label>
      <input
        type="file"
        className="form-control-file"
        id="nombramiento"
        onChange={(e) => handleFileChange(e, setNombramiento)}
      />
    </div>

    <div className="form-group">
      <label htmlFor="comprobante">Comprobante Domiciliario</label>
      <input
        type="file"
        className="form-control-file"
        id="comprobante"
        onChange={(e) => handleFileChange(e, setComprobante)}
      />
    </div>

    <div className="form-group">
      <label htmlFor="convenio">Convenio</label>
      <input
        type="file"
        className="form-control-file"
        id="convenio"
        onChange={(e) => handleFileChange(e, setConvenio)}
      />
    </div>

    <button
      onClick={handleSubmitF}
      className="btn btn-primary"
    >
      Subir Documentos
    </button>   
  </div>
  </div>
  
  <div className="container bg-white p-4 rounded shadow">
      <h3 className="mb-3">Descargar Convenio</h3>

      <div className="mb-3">
        <label className="form-label">Selecciona una empresa:</label>
        <select
          className="form-select"
          value={empresaSeleccionada}
          onChange={(e) => setEmpresaSeleccionada(e.target.value)}
        >
          <option value="">-- Selecciona una empresa --</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.empresa_nombre}>
              {empresa.empresa_nombre}
            </option>
          ))}
        </select>
        
      </div>

      <button
        className="btn btn-primary"
        onClick={() => handleDownloadConvenio(empresaSeleccionada)}
        disabled={!empresaSeleccionada} // Deshabilita el botón si no se seleccionó ninguna empresa
      >
        Descargar Convenio
      </button>
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
        </div>
      </div>

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
                    <p><strong>Tutor:</strong> {respuesta.nombre_Tutor}</p>
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

    </>
  );
};

export default DashboardVinculacion;
