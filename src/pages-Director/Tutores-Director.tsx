import { useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select"; // Importar react-select

const API_URL = "http://localhost:3000";

interface Props {
  setUserRole: (role: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
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

const TutoresDirector = ({ setUserRole, setIsAuthenticated }: Props) => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [tutor, setTutor] = useState({
    nombre: '',
    telefono: '',
    correoElectronico: '',
    usuario:'',
    password: '',
    id_alumno: null,
  });
  
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

  const registrarTutor = () => {
    axios
      .post(`${API_URL}/registrar-tutor-interno`, tutor)
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

  const handleChanges = (selectedOption: any) => {
    setTutor((prev) => ({
      ...prev,
      id_alumno: selectedOption ? selectedOption.value : null,
    }));
  };

  const formatOptions = estudiantes.map((alumno) => ({
    label: alumno.nombre,
    value: alumno.id,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  const [tutorExterno, setTutorExterno] = useState({
    nombre_Tutor: '',
    telefono_Tutor: '',
    correo_electronico_Tutor: '',
    usuario: '', 
    password: '',
    id_alumno: null,
  });

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    // Convertir números si el campo es numérico
    const newValue = type === "number" ? (value ? parseInt(value, 10) : "") : value;
  
    setTutorExterno((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAlumnoSelect = (selectedOption: any) => {
    setTutorExterno((prev) => ({
      ...prev,
      id_alumno: selectedOption ? selectedOption.value : "",
    }));
  };

  const formatOptions1 = estudiantes.map((alumno) => ({
    label: alumno.nombre,
    value: alumno.id,
  }));
  
  
  
  const registrarTutorExterno = () => {
    fetch(`${API_URL}/tutores-externos`, {
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
          id_alumno: null,
        });
      })
      .catch((error) => {
        console.error("Error al registrar tutor externo:", error);
        alert("Error al registrar tutor externo");
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
                    TUTORES
                  </h1>
                </div>
              </div>
            </div>
          </div>
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
                        <Select
                          options={formatOptions} // Formatear los estudiantes a la estructura que usa react-select
                          value={formatOptions.find((option) => option.value === tutor.id_alumno)}
                          onChange={handleChanges}
                          placeholder="Buscar alumno"
                          isClearable={true}
                        />
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
                  <label htmlFor="id_alumno">Asignar Alumno</label>
                  {loading ? (
                        <div className="text-center">
                          <i className="fa fa-spinner fa-spin"></i> Cargando...
                        </div>
                      ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                      ) : (
                  <Select
                    options={formatOptions1}
                    value={formatOptions1.find((option) => option.value === tutorExterno.id_alumno)}
                    onChange={handleAlumnoSelect}
                    placeholder="Buscar alumno"
                    isClearable={true}
                  />
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

        </section>
      </div>
    </>
  );
};

export default TutoresDirector;
