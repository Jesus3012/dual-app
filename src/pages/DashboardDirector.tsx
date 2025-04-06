import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
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

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardDirector = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

  
  const [matriculaBuscada, setMatriculaBuscada] = useState<string>('');
  const [estudianteEncontrado, setEstudianteEncontrado] = useState<Estudiante | null>(null);
  const [mostrarDatos, setMostrarDatos] = useState<boolean>(false);
  
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
   
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

      
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
<>
<Navbar handleLogout={handleLogout} />

<div
  className="d-flex justify-content-center align-items-center"
  style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f3f4f6, #e4e9f2)',
    padding: '2rem',
  }}
>
  
  <div className="container">
    {/* Buscar Estudiante Form */}
    <div className="card shadow-sm border-0 rounded-3 mb-4">
      <div className="card-header bg-info text-white text-center">
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

    {/* Modal - Datos del Estudiante */}
    {open && (
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Datos del Estudiante</h5>
              <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Cerrar">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: "350px", overflowY: "auto" }}>
              {error && <div className="alert alert-danger">{error}</div>}

              {mostrarDatos && estudianteEncontrado && (
                <div className="text-muted">
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

      </div>
    </div>
    </>
    
  );
}

export default DashboardDirector;
