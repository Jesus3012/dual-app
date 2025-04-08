import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Tutor {
  id: number;
  nombre: string;
  telefono: string;
  correoElectronico: string;
  usuario: string;
  rol: string;
  id_alumno: number | null;
}

interface TutorExterno {
    id: number;
    nombre_Tutor: string;
    telefono_Tutor: string;
    correo_electronico_Tutor: string;
    usuario: string;
    rol: string;
    id_alumno: number | null;
  }

  const API_URL = "https://modelodual.utpuebla.edu.mx";

const Tutores = ({ setUserRole, setIsAuthenticated }: any) => {
  const navigate = useNavigate();
  const [internos, setInternos] = useState<Tutor[]>([]);
  const [externos, setExternos] = useState<TutorExterno[]>([]);
  type TutorModalData = Tutor | TutorExterno | null;
  const [modalData, setModalData] = useState<TutorModalData>(null);
  const [nuevoIdAlumno, setNuevoIdAlumno] = useState<number | null>(null);
  const [tipoModal, setTipoModal] = useState<"editar" | "idAlumno">("editar");
  const [tipoTutor, setTipoTutor] = useState<"interno" | "externo">("interno");
  
  const cargarTutores = async () => {
    const internosData = await axios.get(`${API_URL}/tutoresInternos`);
    const externosData = await axios.get(`${API_URL}/tutoresExternos`);
    setInternos(internosData.data);
    setExternos(externosData.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    cargarTutores();
  }, [navigate]);

  const handleDelete = async (id: number, tipo: string) => {
    if (confirm("¿Eliminar tutor?")) {
      await axios.delete(`${API_URL}/${tipo}/${id}`);
      alert("Tutor eliminado exitosamente")
      cargarTutores();
    }
  };

  const handleRecuperar = async (id: number, tipo: string) => {
    try {
      const response = await axios.put(`${API_URL}/${tipo}/recuperar/${id}`);
      
      // Aquí ahora debes recibir la contraseña sin encriptar como la pasaste en la respuesta del backend
      const nuevaContraseña = response.data.nuevaContraseña;
      
      // Mostrar la contraseña nueva sin encriptar
      alert(`Contraseña nueva: ${nuevaContraseña}`);
    } catch (error) {
      console.error("Error al recuperar la contraseña:", error);
      alert("Hubo un error al recuperar la contraseña.");
    }
  };
  
  const handleEdit = async () => {
    if (!modalData) return;
  
    const endpoint = tipoTutor === "interno" ? "tutoresInternos" : "tutoresExternos";
  
    if (tipoModal === "editar") {
      await axios.put(`${API_URL}/${endpoint}/${modalData.id}`, modalData);
    }
  
    if (tipoModal === "idAlumno") {
      await axios.put(`${API_URL}/${endpoint}/${modalData.id}`, { id_alumno: nuevoIdAlumno });
    }
    alert("Tutor editado exitosamente")
    cargarTutores();
    setModalData(null);
  };
  
  const openEditModal = (tutor: any, tipo: "editar" | "idAlumno", tipoTutor: "interno" | "externo") => {
    setTipoModal(tipo);
    setModalData(tutor);
    setTipoTutor(tipoTutor);
    if (tipo === "idAlumno") setNuevoIdAlumno(tutor.id_alumno ?? null);
  };
  
  return (
    <>
      <Navbar handleLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUserRole(null);
        setIsAuthenticated(false);
        navigate("/");
      }} />

      <div className="content-wrapper p-4">
        <section className="content">
          <div className="container-fluid">
            {/* Tabla Internos */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title">Tutores Internos</h3>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Usuario</th>
                      <th>Alumno</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internos.map((tutor) => (
                      <tr key={tutor.id}>
                        <td>{tutor.nombre}</td>
                        <td>{tutor.telefono}</td>
                        <td>{tutor.correoElectronico}</td>
                        <td>{tutor.usuario}</td>
                        <td>{tutor.id_alumno ?? "Sin asignar"}</td>
                        <td>
                          <button className="btn btn-warning btn-sm mr-1" onClick={() => openEditModal(tutor, "editar", "interno")}>Editar</button>
                          <button className="btn btn-danger btn-sm mr-1" onClick={() => handleDelete(tutor.id, 'tutoresInternos')}>Eliminar</button>
                          <button className="btn btn-info btn-sm" onClick={() => handleRecuperar(tutor.id, 'tutoresInternos')}>Recuperar</button>
                          {/* <button className="btn btn-secondary btn-sm mr-1" onClick={() => openEditModal(tutor, "idAlumno", "interno")}>Cambiar ID</button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Externos */}
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title">Tutores Externos</h3>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Usuario</th>
                      <th>Alumno</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {externos.map((tutor) => (
                      <tr key={tutor.id}>
                        <td>{tutor.nombre_Tutor}</td>
                        <td>{tutor.telefono_Tutor}</td>
                        <td>{tutor.correo_electronico_Tutor}</td>
                        <td>{tutor.usuario}</td>
                        <td>{tutor.id_alumno ?? "Sin asignar"}</td>
                        <td>
                          <button className="btn btn-warning btn-sm mr-1" onClick={() => openEditModal(tutor, "editar", "externo")}>Editar</button>
                          <button className="btn btn-danger btn-sm mr-1" onClick={() => handleDelete(tutor.id, 'tutoresExternos')}>Eliminar</button>
                          <button className="btn btn-info btn-sm" onClick={() => handleRecuperar(tutor.id, 'tutoresExternos')}>Recuperar</button>
                          {/* <button className="btn btn-secondary btn-sm mr-1" onClick={() => openEditModal(tutor, "idAlumno", "externo")}>Cambiar ID</button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Modal Editar Tutor */}
      {modalData && tipoModal === "editar" && tipoTutor === "interno" && (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editarModalLabel">Editar Tutor</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModalData(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={(modalData as Tutor).nombre}
                    onChange={(e) => setModalData({ ...modalData, nombre: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={(modalData as Tutor).telefono}
                    onChange={(e) => setModalData({ ...modalData, telefono: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={(modalData as Tutor).correoElectronico}
                    onChange={(e) => setModalData({ ...modalData, correoElectronico: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModalData(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleEdit}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Cambiar ID Alumno */}
      {modalData && tipoModal === "idAlumno" && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog" aria-labelledby="cambiarIdModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="cambiarIdModalLabel">Cambiar ID Alumno</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModalData(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nuevo ID Alumno</label>
                  <input
                    type="number"
                    className="form-control"
                    value={nuevoIdAlumno ?? ""}
                    onChange={(e) => setNuevoIdAlumno(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModalData(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleEdit}>Cambiar ID</button>
              </div>
            </div>
          </div>
        </div>
        
      )}

        {modalData && tipoModal === "editar" && tipoTutor === "externo" && (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Editar Tutor Externo</h5>
                <button className="close" onClick={() => setModalData(null)}>
                    <span>&times;</span>
                </button>
                </div>
                <div className="modal-body">
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                    className="form-control"
                    value={(modalData as TutorExterno).nombre_Tutor}
                    onChange={(e) =>
                        setModalData({ ...modalData, nombre_Tutor: e.target.value })
                    }
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                    className="form-control"
                    value={(modalData as TutorExterno).telefono_Tutor}
                    onChange={(e) =>
                        setModalData({ ...modalData, telefono_Tutor: e.target.value })
                    }
                    />
                </div>
                <div className="form-group">
                    <label>Correo</label>
                    <input
                    className="form-control"
                    value={(modalData as TutorExterno).correo_electronico_Tutor}
                    onChange={(e) =>
                        setModalData({ ...modalData, correo_electronico_Tutor: e.target.value })
                    }
                    />
                </div>
                </div>
                <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalData(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleEdit}>Guardar</button>
                </div>
            </div>
            </div>
        </div>
        )}
        {modalData && tipoModal === "idAlumno" && (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Cambiar ID de Alumno</h5>
                <button className="close" onClick={() => setModalData(null)}>
                    <span>&times;</span>
                </button>
                </div>
                <div className="modal-body">
                <div className="form-group">
                    <label>Nuevo ID Alumno</label>
                    <input
                    type="number"
                    className="form-control"
                    value={nuevoIdAlumno ?? ""}
                    onChange={(e) => setNuevoIdAlumno(Number(e.target.value))}
                    />
                </div>
                </div>
                <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalData(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleEdit}>Cambiar ID</button>
                </div>
            </div>
            </div>
        </div>
        )}

    </>
  );
};

export default Tutores;
