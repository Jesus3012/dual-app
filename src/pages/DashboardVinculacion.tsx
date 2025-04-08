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

const API_URL = "http://localhost:3000";

const DashboardVinculacion = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [acta, setActa] = useState<File | null>(null);
  const [nombramiento, setNombramiento] = useState<File | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [convenio, setConvenio] = useState<File | null>(null);
  

  

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
      const response = await axios.get(`${API_URL}/estudiantes`);
      setEstudiantes(response.data);
    } catch (err) {
      console.error("Error al obtener estudiantes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/registrar-vinculacion`, formData);
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
          const response = await axios.get(`${API_URL}/obtener_empresas`);
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
      const response = await axios.post(`${API_URL}/subir_documentos`, formData, {
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
  
    

    const handleDownloadConvenio = async (empresaNombre: string) => {
      try {
        const response = await axios.get(`${API_URL}/descargar_convenio/${empresaNombre}`, {
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
      const response = await fetch(`${API_URL}/upload-carnet/${idEstudiante}`, {
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
          <h3>Registrar Empresa</h3>
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

      <div className="container mt-4">
        {/* Card de Carga de Documentos */}
        <div className="card card-dark shadow mb-4">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">
              <i className="fas fa-upload me-2"></i>Cargar Documentos de la Empresa
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="empresaNombre"><strong><i className="fas fa-building me-2"></i>Nombre de la Empresa</strong></label>
                <input
                  type="text"
                  className="form-control"
                  id="empresaNombre"
                  placeholder="Ej. Industrias XYZ"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="acta"><strong><i className="fas fa-file-alt me-2"></i>Acta Constitutiva</strong></label>
                <input
                  type="file"
                  className="form-control"
                  id="acta"
                  onChange={(e) => handleFileChange(e, setActa)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="nombramiento"><strong><i className="fas fa-user-tie me-2"></i>Nombramiento del Representante Legal</strong></label>
                <input
                  type="file"
                  className="form-control"
                  id="nombramiento"
                  onChange={(e) => handleFileChange(e, setNombramiento)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="comprobante"><strong><i className="fas fa-map-marker-alt me-2"></i>Comprobante Domiciliario</strong></label>
                <input
                  type="file"
                  className="form-control"
                  id="comprobante"
                  onChange={(e) => handleFileChange(e, setComprobante)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="convenio"><strong><i className="fas fa-file-contract me-2"></i>Convenio</strong></label>
                <input
                  type="file"
                  className="form-control"
                  id="convenio"
                  onChange={(e) => handleFileChange(e, setConvenio)}
                />
              </div>
            </div>

            <div className="text-end">
              <button onClick={handleSubmitF} className="btn btn-success mt-3">
                <i className="fas fa-cloud-upload-alt me-2"></i>Subir Documentos
              </button>
            </div>
          </div>
        </div>

        {/* Card de Descarga de Convenio */}
        <div className="card card-primary shadow">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-download me-2"></i>Descargar Convenio
            </h5>
          </div>
          <div className="card-body">
            <div className="row align-items-end">
              <div className="col-md-8 mb-3">
                <label className="form-label"><strong><i className="fas fa-industry me-2"></i>Selecciona una empresa</strong></label>
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
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleDownloadConvenio(empresaSeleccionada)}
                  disabled={!empresaSeleccionada}
                >
                  <i className="fas fa-file-download me-2"></i>Descargar Convenio
                </button>
              </div>
            </div>
          </div>
        </div>
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

        </div>
      </div>
    </>
  );
};

export default DashboardVinculacion;
