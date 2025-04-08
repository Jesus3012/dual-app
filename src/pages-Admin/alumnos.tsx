import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  fechaNacimiento: string;
  curp: string;
  genero: string;
  division: string;
  programaEstudios: string;
  seguridadSocial: string;
  status: string;
  cuatrimestre: number;
  correoElectronico: string;
  telefono: string;
}

const API_URL = "https://modelodual.utpuebla.edu.mx";

const Alumnos = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Alumno>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    cargarAlumnos();
  }, [navigate]);

  const cargarAlumnos = async () => {
    try {
      const res = await axios.get(`${API_URL}/estudiantes`);
      setAlumnos(res.data);
    } catch (err) {
      console.error("Error al cargar alumnos", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar alumno?")) {
      await axios.delete(`${API_URL}/estudiantes/${id}`);
      cargarAlumnos();
    }
  };

  const handleEdit = (alumno: Alumno) => {
    setEditando(alumno.id);
    setForm(alumno);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put(`${API_URL}/estudiantes/${editando}`, form);
    setEditando(null);
    alert('Alumno actualizado correctamente');
    cargarAlumnos();
  };

  const handleRecuperar = async (id: number) => {
    const res = await axios.post(`${API_URL}/estudiantes/recuperar/${id}`);
    alert(`Nueva contraseña: ${res.data.nuevaContraseña}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
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
                      ALUMNOS
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="d-flex justify-content-center">
              <div className="table-responsive" style={{ maxWidth: '1200px',}}>
                <table className="table table-bordered table-hover bg-white">
                  <thead className="thead-dark">
                    <tr>
                      <th>Matrícula</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((alumno) => (
                      <tr key={alumno.id}>
                        <td>{alumno.matricula}</td>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.correoElectronico}</td>
                        <td>{alumno.telefono}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(alumno)}
                            className="btn btn-warning  mr-1"
                            data-toggle="modal"
                            data-target="#editarModal"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(alumno.id)}
                            className="btn btn-danger  mr-1"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => handleRecuperar(alumno.id)}
                            className="btn btn-info"
                          >
                            Recuperar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Modal de edición (fuera de la tabla) */}
            <div
              className="modal fade"
              id="editarModal"
              tabIndex={-1}
              role="dialog"
              aria-labelledby="editarModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editarModalLabel">Editar Alumno</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-row">
                      {[
                        { label: "Matrícula", name: "matricula" },
                        { label: "Nombre", name: "nombre" },
                        { label: "Fecha de Nacimiento", name: "fechaNacimiento", type: "date" },
                        { label: "CURP", name: "curp" },
                        { label: "Género", name: "genero" },
                        { label: "División", name: "division" },
                        { label: "Programa de Estudios", name: "programaEstudios" },
                        { label: "Seguridad Social", name: "seguridadSocial" },
                        { label: "Status", name: "status" },
                        { label: "Cuatrimestre", name: "cuatrimestre", type: "number" },
                        { label: "Correo Electrónico", name: "correoElectronico" },
                        { label: "Teléfono", name: "telefono" }
                      ].map((campo, idx) => (
                        <div className="form-group col-md-6" key={idx}>
                          <label>{campo.label}</label>
                          <input
                            type={campo.type || "text"}
                            name={campo.name}
                            value={(form as any)[campo.name] || ""}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" className="btn btn-success" onClick={handleSave} data-dismiss="modal">Guardar Cambios</button>
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

export default Alumnos;
