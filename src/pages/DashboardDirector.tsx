import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar';

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

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardDirector = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [asignaciones, setAsignaciones] = useState<{ [key: number]: number | null }>({});
  
  const [matriculaBuscada, setMatriculaBuscada] = useState<string>('');
  const [estudianteEncontrado, setEstudianteEncontrado] = useState<Estudiante | null>(null);
  const [mostrarDatos, setMostrarDatos] = useState<boolean>(false);
  const [tutor, setTutor] = useState({
    nombre: '',
    telefono: '',
    correoElectronico: '',
    usuario:'',
    password: '',
    id_alumno: null,
  });
  const [empresa, setEmpresa] = useState("");
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
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    matricula: "",
    nombre: "",
    fechaNacimiento: "",
    curp: "",
    genero: "",
    division: "",
    programaEstudios: "",
    seguridadSocial: "",
    status: "",
    cuatrimestre: "",
    correoElectronico: "",
    telefono: "",
    usuario:"",
    password:"",
    idEmpresa: null,
    idDirector: null,
    idVinculacion: null,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({ ...prev, [name]: value }));
  };
  
  // Llamar a la API al cargar el componente
  useEffect(() => {
    fetch('http://localhost:3000/estudiantes')
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

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTutor((prev) => ({
      ...prev,
      [name]: name === "id_alumno" ? (value ? Number(value) : null) : value,
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/empresas")
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

  const handleSeleccion = (id_empresa: number, id_estudiante: number | null) => {
    setAsignaciones((prev) => ({
      ...prev,
      [id_empresa]: id_estudiante,
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  const guardarAsignacion = (id_empresa: number) => {
    const id_estudiante = asignaciones[id_empresa];
    if (!id_estudiante) {
      alert("Selecciona un estudiante antes de guardar.");
      return;
    }

    axios
      .put("http://localhost:3000/asignar-estudiante", {
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

  // Función para buscar estudiante por matrícula
  const buscarEstudiante = () => {
    setMostrarDatos(false); // Ocultar datos anteriores
    setEstudianteEncontrado(null);
    setError(null);

    fetch(`http://localhost:3000/buscar-estudiante/${matriculaBuscada}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Matrícula no encontrada");
        }
        return res.json();
      })
      .then((data) => {
        setEstudianteEncontrado(data);
        setMostrarDatos(true);
        setOpen(true); // Abrir el modal con los datos del estudiante
      })
      .catch((error) => {
        console.error("Error al buscar estudiante:", error);
        setMostrarDatos(false);
        alert("Matrícula no encontrada");
      });
};

const registrarManualmenteEnDuale = async () => {
  if (!estudianteEncontrado) {
      alert('No hay estudiante encontrado para registrar.');
      setOpen(false);
      // Limpiar los campos si no se encuentra el estudiante
      setMatriculaBuscada('');
      setUsuario('');
      setPassword('');
      setEstudianteEncontrado(null); 
      setMostrarDatos(false);
      return;
  }

  if (!usuario.trim() || !password.trim()) {
      alert("Usuario y contraseña son obligatorios.");
      return;
  }
  try {
      const response = await fetch('http://localhost:3000/registrar-manualmente-duale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              ...estudianteEncontrado,
              usuario,
              password, // Se encriptará en el backend
          }),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Error desconocido al registrar el estudiante.");
      }

      alert('Estudiante registrado exitosamente en la base de datos Duale.');
      setOpen(false);

      // Limpiar los campos después de la inserción exitosa
      setMatriculaBuscada('');
      setUsuario('');
      setPassword('');
      setEstudianteEncontrado(null);
      setMostrarDatos(false);

  } catch (error) {
      console.error('Error al registrar estudiante:', error);
      alert(error instanceof Error ? error.message : 'Error al registrar estudiante.');

      // Limpiar los campos en caso de error
      setMatriculaBuscada('');
      setUsuario('');
      setPassword('');
      setEstudianteEncontrado(null);
      setMostrarDatos(false);
      setOpen(false);
  }
};


  // Función para registrar estudiante en duale
  const registrarEstudianteEnDuale = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita recargar la página

    try {
      const response = await fetch("http://localhost:3000/registrar-estudiante-duale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEstudiante),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Estudiante registrado con éxito");

        setNuevoEstudiante({
          matricula: "", nombre: "", fechaNacimiento: "", curp: "", genero: "", division: "", programaEstudios: "",seguridadSocial: "",
          status: "", cuatrimestre: "", correoElectronico: "",telefono: "", password:"", usuario:"", idEmpresa: null, idDirector: null, idVinculacion: null,
        });
      }
    } catch (error) {
      console.error("Error al registrar estudiante:", error);
      alert("Hubo un error al registrar el estudiante.");
    }
  };
  
  const registrarTutor = () => {
    axios
      .post("http://localhost:3000/registrar-tutor-interno", tutor)
      .then((response) => {
        alert(response.data.message);
        setTutor({
          nombre: "",
          telefono: "",
          correoElectronico: "",
          usuario: "",
          password: "",
          id_alumno: null,
        });
      })
      .catch((error) => {
        console.error("Error al registrar tutor:", error);
        alert("Error al registrar tutor interno");
      });
  };

  const buscarEmpresa = async () => {
    try {
      const response = await fetch(`http://localhost:3000/empresa/${empresa}`);
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
      const response = await fetch("http://localhost:3000/subir-empresa", {
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
  

  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rol, setRol] = useState<string>('Administrador'); // Por defecto el rol es 'Administrador'
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = { usuario, password, rol };
  
      fetch('http://localhost:3000/registrar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error);
          alert('Error al registrar usuario');
        });
    };

    const [tutorExterno, setTutorExterno] = useState({
      nombre_Tutor: '',
      telefono_Tutor: '',
      correo_electronico_Tutor: '',
      usuario: '', 
      password: '',
      id_alumno: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
    
      // Convertir números si el campo es numérico
      const newValue = type === "number" ? (value ? parseInt(value, 10) : "") : value;
    
      setTutorExterno((prev) => ({ ...prev, [name]: newValue }));
    };
    
    
    
    const registrarTutorExterno = () => {
      fetch("http://localhost:3000/tutores-externos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tutorExterno),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setTutorExterno({
            nombre_Tutor: "",
            telefono_Tutor: "",
            correo_electronico_Tutor: "",
            usuario: "",
            password: "",
            id_alumno: "",
          });
        })
        .catch((error) => {
          console.error("Error al registrar tutor externo:", error);
          alert("Error al registrar tutor externo");
        });
    };
    
    
    
      
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
<>
<Navbar handleLogout={handleLogout} />    
<div className="container">
<div className="container mt-5">
  <div className="card shadow-lg">
    <div className="card-header bg-success text-white text-center">
      <h2 className="mb-0">Registrar Usuario</h2>
    </div>
    <div className="card-body">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="rol" className="form-label">Rol:</label>
          <select
            name="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="form-control"
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="Director">Director</option>
            <option value="Vinculación">Vinculación</option>
          </select>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success">Registrar Usuario</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div className="container mt-4 d-flex justify-content-center">
  <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
    <div className="card-header bg-success text-white text-center">
      <h2 className="mb-0">Buscar Estudiante</h2>
    </div>
    <div className="card-body">
      <div className="form-group mb-3">
        <label className="form-label">Introduce matrícula:</label>
        <div className="input-group">
          <input
            type="text"
            placeholder="Matrícula"
            value={matriculaBuscada}
            onChange={(e) => setMatriculaBuscada(e.target.value)}
            className="form-control"
          />
          <button className="btn btn-primary" onClick={buscarEstudiante}>
            Buscar Estudiante
          </button>
        </div>
      </div>
    </div>
  </div>

  {open && (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Datos del Estudiante</h5>
            <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{ maxHeight: "350px", overflowY: "auto" }}>
            {error && <div className="alert alert-danger">{error}</div>}

            {mostrarDatos && estudianteEncontrado && (
              <div>
                <p><strong>Matrícula:</strong> {estudianteEncontrado.matricula}</p>
                <p><strong>Nombre:</strong> {estudianteEncontrado.nombre}</p>
                <p><strong>Fecha de Nacimiento:</strong> {estudianteEncontrado.fecha_nacimiento}</p>
                <p><strong>CURP:</strong> {estudianteEncontrado.curp}</p>
                <p><strong>Género:</strong> {estudianteEncontrado.genero}</p>
                <p><strong>División:</strong> {estudianteEncontrado.division}</p>
                <p><strong>Programa de Estudios:</strong> {estudianteEncontrado.programa_estudios}</p>
                <p><strong>Seguridad Social:</strong> {estudianteEncontrado.seguridad_social}</p>
                <p><strong>Status:</strong> {estudianteEncontrado.status}</p>
                <p><strong>Cuatrimestre:</strong> {estudianteEncontrado.cuatrimestre}</p>
                <p><strong>Correo Electrónico:</strong> {estudianteEncontrado.correo_electronico}</p>
                <p><strong>Teléfono:</strong> {estudianteEncontrado.telefono}</p>

                {/* Usuario y Contraseña */}
                <div className="form-group mt-3">
                  <label><strong>Usuario:</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
                <div className="form-group mt-2">
                  <label><strong>Contraseña:</strong></label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Ingrese contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button className="btn btn-success btn-block mt-3" onClick={registrarManualmenteEnDuale}>
                  <i className="fas fa-upload"></i> Subir a BD Dual
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h3 className="text-center text-primary mb-4">Registrar Estudiante</h3>
        <form onSubmit={registrarEstudianteEnDuale}>
          <div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  name="matricula"
                  placeholder="Matrícula"
                  value={nuevoEstudiante.matricula}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={nuevoEstudiante.nombre}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={nuevoEstudiante.fechaNacimiento ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    // Permitir que el usuario borre el contenido
                    if (value === "") {
                      handleInputChange(e);
                      return;
                    }

                    // Validar que el valor sea una fecha válida
                    const fechaValida = !isNaN(Date.parse(value));
                    if (fechaValida) {
                      handleInputChange(e);
                    }
                  }}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="curp"
                  placeholder="CURP"
                  value={nuevoEstudiante.curp}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="genero"
                  placeholder="Género"
                  value={nuevoEstudiante.genero}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="division"
                  placeholder="División"
                  value={nuevoEstudiante.division}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="usuario"
                  placeholder="Usuario"
                  value={nuevoEstudiante.usuario ?? ""}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="programaEstudios"
                  placeholder="Programa de Estudios"
                  value={nuevoEstudiante.programaEstudios}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="seguridadSocial"
                  placeholder="Seguridad Social"
                  value={nuevoEstudiante.seguridadSocial}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={nuevoEstudiante.status}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="number"
                  name="cuatrimestre"
                  placeholder="Cuatrimestre"
                  value={nuevoEstudiante.cuatrimestre ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    // Permitir que el usuario borre el contenido
                    if (value === "") {
                      handleInputChange(e);
                      return;
                    }

                    const numericValue = parseInt(value, 10);

                    // Validar que el número esté entre 1 y 11
                    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 11) {
                      handleInputChange(e);
                    }
                  }}
                  min="1"
                  max="11"
                  className="form-control mb-2"
                  required
                />
                <input
                  type="email"
                  name="correoElectronico"
                  placeholder="Correo Electrónico"
                  value={nuevoEstudiante.correoElectronico}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={nuevoEstudiante.telefono}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  required
                />
                <div className="input-group mb-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={nuevoEstudiante.password ?? ""}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const passInput = document.querySelector('[name="password"]') as HTMLInputElement;
                        passInput.type = passInput.type === "password" ? "text" : "password";
                        passInput.nextElementSibling!.querySelector("i")!.classList.toggle("fa-eye-slash");
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-3">
              Registrar Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>

    <div className="container mt-5">
      {estudiantes.length > 0 ? (
        <div className="card shadow-lg">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Estudiantes Registrados</h3>
            <div className="card-tools">
            <button className="btn btn-outline-light btn-sm d-flex align-items-center" onClick={() => window.location.replace(window.location.href)}
            >
                <i className="fas fa-sync-alt me-1"></i> Actualizar
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover dataTable dtr-inline">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Matrícula</th>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est) => (
                    <tr key={est.id}>
                      <td>{est.id}</td>
                      <td>{est.matricula}</td>
                      <td>{est.nombre}</td>
                      <td>{est.correoElectronico}</td>
                      <td>{est.telefono}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center mt-4" role="alert">
          <i className="fas fa-exclamation-circle"></i> No hay estudiantes registrados en BD Dual.
        </div>
      )}
    </div>

    <div className="container mt-5">
      <div className="card card-primary shadow-lg">
        <div className="card-header">
          <h3 className="card-title">Registrar Tutor Interno (UTP)</h3>
        </div>
        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registrarTutor();
            }}
          >
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingrese el nombre del tutor"
                value={tutor.nombre}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                name="telefono"
                placeholder="Ingrese el teléfono"
                value={tutor.telefono}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="form-group">
              <label htmlFor="correoElectronico">Correo Electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                placeholder="Ingrese el correo electrónico"
                value={tutor.correoElectronico}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* Usuario */}
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                name="usuario"
                placeholder="Ingrese un nombre de usuario"
                value={tutor.usuario}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingrese una contraseña segura"
                  value={tutor.password}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Asignación de Alumno */}
            <div className="form-group">
              <label htmlFor="id_alumno">Asignar Alumno</label>
              {loading ? (
                <div className="text-center">
                  <i className="fa fa-spinner fa-spin"></i> Cargando...
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <select
                  name="id_alumno"
                  className="form-control"
                  value={tutor.id_alumno || ""}
                  onChange={handleChanges}
                >
                  <option value="">Seleccionar Alumno</option>
                  {estudiantes.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Botón de Registro */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="fas fa-user-plus"></i> Registrar Tutor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

<div className="container mt-5">
  <div className="card shadow-lg p-4">
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
              <button
                onClick={subirEmpresa}
                className="btn btn-success btn-block"
              >
                Subir a Vinculación
              </button>
            </div>
          ) : (
            <p>No se encontraron datos de la empresa.</p>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setModalOpen(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
  )}
</div>

<div className="card">
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
                        style={{ width: "200px" }} // Ajusta el ancho según necesites
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

<div className="container mt-5">
  <div className="card card-primary shadow-lg">
    <div className="card-header">
      <h3 className="card-title">Registrar Tutor Externo</h3>
    </div>
    <div className="card-body">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          registrarTutorExterno();
        }}
      >
        {/* Nombre del Tutor */}
        <div className="form-group">
          <label htmlFor="nombre_Tutor">Nombre del Tutor</label>
          <input
            type="text"
            name="nombre_Tutor"
            placeholder="Nombre del Tutor"
            value={tutorExterno.nombre_Tutor}
            onChange={handleInputChanges}
            required
            className="form-control"
          />
        </div>

        {/* Teléfono del Tutor */}
        <div className="form-group">
          <label htmlFor="telefono_Tutor">Teléfono del Tutor</label>
          <input
            type="text"
            name="telefono_Tutor"
            placeholder="Teléfono del Tutor"
            value={tutorExterno.telefono_Tutor}
            onChange={handleInputChanges}
            required
            className="form-control"
          />
        </div>

        {/* Correo Electrónico del Tutor */}
        <div className="form-group">
          <label htmlFor="correo_electronico_Tutor">Correo Electrónico del Tutor</label>
          <input
            type="email"
            name="correo_electronico_Tutor"
            placeholder="Correo Electrónico del Tutor"
            value={tutorExterno.correo_electronico_Tutor}
            onChange={handleInputChanges}
            required
            className="form-control"
          />
        </div>

        {/* Usuario */}
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            name="usuario"
            placeholder="Usuario del Tutor"
            value={tutorExterno.usuario}
            onChange={handleInputChanges}
            required
            className="form-control"
          />
        </div>

        {/* Contraseña */}
        <div className="form-group">
      <label htmlFor="password">Contraseña</label>
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"} // Cambia entre 'text' y 'password' según el estado
          name="password"
          placeholder="Ingrese una contraseña segura"
          value={tutorExterno.password}
          onChange={handleInputChanges}
          required
          className="form-control"
        />
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)} // Alterna la visibilidad
          >
            <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i> {/* Cambia el icono */}
          </button>
        </div>
      </div>
    </div>
        {/* Seleccionar Alumno */}
        <div className="form-group">
          <label htmlFor="id_alumno">Seleccionar Alumno</label>
          <select
            name="id_alumno"
            value={tutorExterno.id_alumno || ""}
            onChange={handleInputChanges}
            className="form-control"
          >
            <option value="">Seleccione un alumno</option>
            {estudiantes.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de Registro */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            <i className="fas fa-user-plus"></i> Registrar Tutor
          </button>
        </div>
      </form>
    </div>
  </div>
</div>



    </div>
 
    </>
  );
}

export default DashboardDirector;
