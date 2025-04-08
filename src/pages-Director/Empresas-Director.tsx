import { useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

interface Empresa {
  id: number;
  nombre_empresa: string;
  direccion: string;
  contacto_nombre: string;
  contacto_puesto: string;
  correo_electronico: string;
  telefono: string | null;
  pagina_web: string | null;
  estado_convenio: string;
  fecha_inicio: string;
  fecha_fin: string;
  sector: string;
  tamano_empresa: string;
  ubicacion: string;
  id_estudiante: number | null;
}

interface Estudiante {
  id: number;
  matricula: string;
  nombre: string;
  correo_electronico: string;
  correoElectronico: string;
  telefono: string;
  fecha_nacimiento?: string;
  curp?: string;
  genero?: string;
  division?: string;
  programa_estudios?: string;
  seguridad_social?: string;
  status?: string;
  cuatrimestre?: number;
}

const API_URL = "https://modelodual.utpuebla.edu.mx";

const EmpresasDirector = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresa, setEmpresa] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorEmpresa, setErrorEmpresa] = useState<string | null>(null);
    const [datosEmpresa, setDatosEmpresa] = useState({
      nombre_empresa:'',
      direccion:'',
      contacto_nombre:'',
      contacto_puesto:'',
      correo_electronico:'',
      telefono:'',
      pagina_web:'',
    });
    const [asignaciones, setAsignaciones] = useState<{ [key: number]: number | null }>({});
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  
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
    fetch(`${API_URL}/estudiantes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener los estudiantes');
        }
        return res.json();
      })
      .then((data) => {
        setEstudiantes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener estudiantes:', error);
        setError('Error al obtener los estudiantes');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/empresas`)
      .then((response) => {
        setEmpresas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener empresas:", error);
        setError("Error al obtener empresas");
        setLoading(false);
      });
  }, []);

  const buscarEmpresa = async () => {
    try {
      const response = await fetch(`${API_URL}/empresa/${empresa}`);
      if (!response.ok) {
        throw new Error("Empresa no encontrada");
      }
      const data = await response.json();
      
      setDatosEmpresa(data);
      setErrorEmpresa(null);
      
      // Abre el modal después de recibir los datos
      setModalOpen(true);
    } catch (error) {
      console.error("Error al buscar empresa:", error);
      alert("Empresa no encontrada");
      setDatosEmpresa({
        nombre_empresa: "",
        direccion: "",
        contacto_nombre: "",
        contacto_puesto: "",
        correo_electronico: "",
        telefono: "",
        pagina_web: "",
      });
      
      // Asegúrate de cerrar el modal si ocurre un error
      setModalOpen(false);
    }
  };
  
  const subirEmpresa = async () => {
    if (!datosEmpresa.nombre_empresa) return alert("Primero busca una empresa");
  
    try {
      const response = await fetch(`${API_URL}/subir-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEmpresa),
      });
  
      const result = await response.json();
  
      if (response.status === 400) {
        alert("La empresa ya está registrada");
      } else {
        alert(result.message);
      }
      
      // Cerrar el modal después de subir la empresa (en ambos casos, ya sea duplicada o subida correctamente)
      setModalOpen(false);
    } catch (error) {
      console.error("Error al subir empresa:", error);
      
      // Cerrar el modal si hay un error en la solicitud
      setModalOpen(false);
    }
  };

  const handleSeleccion = (id_empresa: number, id_estudiante: number | null) => {
    setAsignaciones((prev) => ({
      ...prev,
      [id_empresa]: id_estudiante,
    }));
  };
  
  const guardarAsignacion = (id_empresa: number) => {
    const id_estudiante = asignaciones[id_empresa];
    if (!id_estudiante) {
      alert("Selecciona un estudiante antes de guardar.");
      return;
    }

    axios
      .put(`${API_URL}/asignar-estudiante`, {
        id_empresa,
        id_estudiante,
      })
      .then(() => {
        setEmpresas((prev) =>
          prev.map((empresa) =>
            empresa.id === id_empresa ? { ...empresa, id_estudiante } : empresa
          )
        );
        alert("Estudiante asignado correctamente.");
      })
      .catch((error) => {
        console.error("Error al asignar estudiante:", error);
        alert("Hubo un error al guardar.");
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
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h1 className="card-title text-center  font-weight-bold">
                    <i className="fas  mr-2"></i>
                    EMPRESAS
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        
          <div className="container mt-5">
            {/* Tarjeta para la búsqueda */}
            <div className="card shadow-lg p-4 mb-5">
              <h3 className="text-center text-primary mb-4">Buscar Empresa</h3>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Nombre de la empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    onClick={buscarEmpresa}
                    className="btn btn-info btn-lg px-4"
                    disabled={!empresa.trim()}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
  
            {/* Modal de datos de la empresa */}
            {modalOpen && (
              <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header bg-info text-white">
                      <h5 className="modal-title">Datos de la Empresa</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setModalOpen(false)}
                        aria-label="Cerrar"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {errorEmpresa && <p className="text-danger">{errorEmpresa}</p>}
                      {datosEmpresa.nombre_empresa ? (
                        <div>
                          <div className="mb-3">
                            <p><strong>Nombre:</strong> {datosEmpresa.nombre_empresa}</p>
                            <p><strong>Dirección:</strong> {datosEmpresa.direccion}</p>
                            <p><strong>Nombre de contacto:</strong> {datosEmpresa.contacto_nombre}</p>
                            <p><strong>Puesto de contacto:</strong> {datosEmpresa.contacto_puesto}</p>
                          </div>
                          <div className="mb-3">
                            <p><strong>Correo electrónico:</strong> {datosEmpresa.correo_electronico}</p>
                            <p><strong>Teléfono:</strong> {datosEmpresa.telefono}</p>
                            <p><strong>Página web:</strong> {datosEmpresa.pagina_web}</p>
                          </div>
                          <button onClick={subirEmpresa} className="btn btn-success btn-block">
                            Subir a Vinculación
                          </button>
                        </div>
                      ) : (
                        <p>No se encontraron datos de la empresa.</p>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Lista de Empresas Vinculadas */}
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title">Lista de Empresas Vinculadas</h3>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <i className="fa fa-spinner fa-spin fa-2x"></i> Cargando...
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>ID</th>
                          <th>Empresa</th>
                          <th>Contacto</th>
                          <th>Correo</th>
                          <th>Estado Convenio</th>
                          <th>Sector</th>
                          <th>Ubicación</th>
                          <th>Estudiante</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empresas.map((empresa) => (
                          <tr key={empresa.id}>
                            <td>{empresa.id}</td>
                            <td>{empresa.nombre_empresa}</td>
                            <td>{empresa.contacto_nombre}</td>
                            <td>{empresa.correo_electronico}</td>
                            <td>
                              <span
                                className={`badge ${
                                  empresa.estado_convenio === "activo"
                                    ? "badge-success"
                                    : empresa.estado_convenio === "renovado"
                                    ? "badge-warning"
                                    : "badge-danger"
                                }`}
                              >
                                {empresa.estado_convenio}
                              </span>
                            </td>
                            <td>{empresa.sector}</td>
                            <td>{empresa.ubicacion}</td>
                            <td>
                              <select
                                className="form-control"
                                style={{ width: "200px" }}
                                value={asignaciones[empresa.id] || empresa.id_estudiante || ""}
                                onChange={(e) =>
                                  handleSeleccion(empresa.id, e.target.value ? Number(e.target.value) : null)
                                }
                              >
                                <option value="">Seleccionar estudiante</option>
                                {estudiantes.map((est) => (
                                  <option key={est.id} value={est.id}>
                                    {est.nombre}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => guardarAsignacion(empresa.id)}
                              >
                                Guardar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
  
};

export default EmpresasDirector;
