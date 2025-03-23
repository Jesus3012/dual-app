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
  const [tutor, setTutor] = useState({
    nombre: '',
    id: '',
    telefono: '',
    correoElectronico: '',
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
    matricula: '',
    nombre: '',
    correoElectronico: '',
    telefono: '',
    fecha_nacimiento: '',
    curp: '',
    genero: '',
    division: '',
    programa_estudios: '',
    seguridad_social: '',
    status: '',
    cuatrimestre: undefined,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({ ...prev, [name]: value }));
  };

  const registrarEstudiante = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:3000/registrar-estudiante-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoEstudiante),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setNuevoEstudiante({
          matricula: '', nombre: '', correoElectronico: '', telefono: '',
          fecha_nacimiento: '', curp: '', genero: '', division: '',
          programa_estudios: '', seguridad_social: '', status: '',
          cuatrimestre: undefined,
        });
      })
      .catch((error) => {
        console.error('Error al registrar estudiante:', error);
        alert('Error al registrar estudiante');
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  // Función para buscar estudiante por matrícula
  const buscarEstudiante = () => {
    fetch(`http://localhost:3000/buscar-estudiante/${matriculaBuscada}`)
      .then((res) => res.json())
      .then((data) => {
        setEstudianteEncontrado(data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error al buscar estudiante:', error);
        setError('Estudiante no encontrado');
        setEstudianteEncontrado(null);
      });
  };

  // Función para registrar estudiante en duale
  const registrarEstudianteEnDuale = () => {
    if (estudianteEncontrado) {
      fetch('http://localhost:3000/registrar-estudiante-duale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudianteEncontrado),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error); // Mostrar el mensaje de error
          } else {
            alert(data.message); // Si es exitoso, mostrar el mensaje de éxito
          }
        })
        .catch((error) => {
          console.error('Error al registrar estudiante:', error);
          alert('Error al registrar estudiante');
        });
    }
  };
  
  
  const registrarTutor = () => {
    console.log('Datos enviados:', tutor); // Depuración
  
    fetch('http://localhost:3000/registrar-tutor-interno', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutor),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setTutor({ nombre: '', id: '', telefono: '', correoElectronico: '' });
      })
      .catch((error) => {
        console.error('Error al registrar tutor interno:', error);
        alert('Error al registrar tutor interno');
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
    } catch (error) {
      console.error("Error al buscar empresa:", error);
      setErrorEmpresa("Empresa no encontrada");
      setDatosEmpresa({
        nombre_empresa: "",
        direccion: "",
        contacto_nombre: "",
        contacto_puesto: "",
        correo_electronico: "",
        telefono: "",
        pagina_web: "",
      });
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
      alert(result.message);
    } catch (error) {
      console.error("Error al subir empresa:", error);
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
    });
    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTutorExterno((prev) => ({ ...prev, [name]: value }));
    };
  
    const registrarTutorExterno = (e: React.FormEvent) => {
      e.preventDefault();
      fetch('http://localhost:3000/tutores-externos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorExterno),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setTutorExterno({ nombre_Tutor: '', telefono_Tutor: '', correo_electronico_Tutor: '' });
        })
        .catch((error) => {
          console.error('Error al registrar tutor externo:', error);
          alert('Error al registrar tutor externo');
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
<Navbar handleLogout={handleLogout} />    <div className="container">
<div className="container mt-5">
  <div className="card">
        <h1 className="text-center text mb-4">Registrar Usuario</h1>
        <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="form-control mb"
              required
            />
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-2"

              required
            />
            <label htmlFor="rol" className="form-label">Rol:</label>
            <select
              name="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="form-control mb-2"
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Director">Director</option>
              <option value="tutorInterno">Tutor Interno</option>
              <option value="tutorExterno">Tutor Externo</option>
              <option value="Alumno">Alumno</option>
              <option value="Vinculación">Vinculación</option>
            </select>
            <button type="submit" className="btn btn-success btn-block">Registrar Usuario</button>
          </form>
          </div> 
      </div>

      <div className="container mt-4">
        <div className="card">
              <h2 className="text-center text-success mb-4">Buscar Estudiante</h2>
            <div className="form-group mb-4">
              <input
                type="text"
                placeholder="Introduce matrícula"
                value={matriculaBuscada}
                onChange={(e) => setMatriculaBuscada(e.target.value)}
                className="form-control mb-2"
              />
              <button onClick={buscarEstudiante} className="btn btn-info btn-block">Buscar Estudiante</button>
            </div>
        </div>
      </div>

      {error && <p>{error}</p>}

      {estudianteEncontrado && (
        <div className="container mt-5">
        <div className="card">
          <div className="bg-light p-3 rounded mb-4">
            <h3 className="text-success">Datos del Estudiante</h3>
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
          </div>
        </div>
        </div>
      )}


<div className="container mt-5">
  <div className="card">
<h2 className="text-center text-success mb-4">Registrar Estudiante</h2>
      <form onSubmit={registrarEstudianteEnDuale}>
        <div className="form-group">
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
          <input
            type="date"
            name="fecha_nacimiento"
            placeholder="Fecha de Nacimiento"
            value={nuevoEstudiante.fecha_nacimiento}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="curp"
            placeholder="CURP"
            value={nuevoEstudiante.curp}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="genero"
            placeholder="Género"
            value={nuevoEstudiante.genero}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="division"
            placeholder="División"
            value={nuevoEstudiante.division}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="programa_estudios"
            placeholder="Programa de Estudios"
            value={nuevoEstudiante.programa_estudios}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="seguridad_social"
            placeholder="Seguridad Social"
            value={nuevoEstudiante.seguridad_social}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={nuevoEstudiante.status}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="cuatrimestre"
            placeholder="Cuatrimestre"
            value={nuevoEstudiante.cuatrimestre}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <button type="submit" className="btn btn-primary btn-block">Registrar Estudiante</button>
        </div>
      </form>
      </div>
      </div>

      
      <h2 className="text-center text-success mb-4">Lista de Estudiantes en BD Duale</h2>
{estudiantes.length > 0 ? (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Estudiantes Registrados</h3>
    </div>
    <div className="card-body">
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Matrícula</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
) : (
  <p>No hay estudiantes registrados en BD Duale.</p>
)}

<div className="container mt-5">
  <div className="card">
<h2 className="text-center text-success mb-4">Registrar Tutor Interno (UTP)</h2>
<form
  onSubmit={(e) => {
    e.preventDefault();
    registrarTutor();
  }}
  className="form-horizontal"
>
  <div className="form-group">
    <label htmlFor="nombre" className="col-sm-2 control-label">Nombre</label>
    <div className="col-sm-10">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        maxLength={50}
        value={tutor.nombre}
        onChange={handleChange}
        required
        className="form-control"
      />
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="id" className="col-sm-2 control-label">ID</label>
    <div className="col-sm-10">
      <input
        type="number"
        name="id"
        placeholder="ID"
        maxLength={5}
        value={tutor.id}
        onChange={(e) => setTutor({ ...tutor, id: e.target.value })}
        required
        className="form-control"
      />
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="telefono" className="col-sm-2 control-label">Teléfono</label>
    <div className="col-sm-10">
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        maxLength={10}
        value={tutor.telefono}
        onChange={handleChange}
        required
        className="form-control"
      />
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="correoElectronico" className="col-sm-2 control-label">Correo Electrónico</label>
    <div className="col-sm-10">
      <input
        type="email"
        name="correoElectronico"
        placeholder="Correo Electrónico"
        maxLength={30}
        value={tutor.correoElectronico}
        onChange={handleChange}
        required
        className="form-control"
      />
    </div>
  </div>

  <div className="form-group">
    <div className="col-sm-offset-2 col-sm-10">
      <button type="submit" className="btn btn-primary btn-block">Registrar Tutor</button>
    </div>
  </div>
</form>
</div>
</div>

<div className="container mt-5">
  <div className="card">
<h2 className="text-center text-success mb-4">Buscar Empresa</h2>
<div className="input-group">
  <input 
    type="text" 
    className="form-control"
    placeholder="Nombre de la empresa" 
    value={empresa} 
    onChange={(e) => setEmpresa(e.target.value)} 
  />
  <div className="input-group-append">
    <button onClick={buscarEmpresa} className="btn btn-info">Buscar</button>
  </div>
</div>
</div>
</div>

{errorEmpresa && <p className="text-danger">{errorEmpresa}</p>}

{datosEmpresa.nombre_empresa && (
  <div className="container mt-5">
  <div className="card">
  <div className="card mt-4">
    <div className="card-header">
      <h3 className="card-title">Datos de la Empresa</h3>
    </div>
    <div className="card-body">
      <p><b>Nombre:</b> {datosEmpresa.nombre_empresa}</p>
      <p><b>Dirección:</b> {datosEmpresa.direccion}</p>
      <p><b>Nombre de contacto:</b> {datosEmpresa.contacto_nombre}</p>
      <p><b>Puesto de contacto:</b> {datosEmpresa.contacto_puesto}</p>
      <p><b>Correo electrónico:</b> {datosEmpresa.correo_electronico}</p>
      <p><b>Teléfono:</b> {datosEmpresa.telefono}</p>
      <p><b>Página web:</b> {datosEmpresa.pagina_web}</p>
      <button onClick={subirEmpresa} className="btn btn-success">Subir a Vinculación</button>
    </div>
  </div>
  </div>
  </div>
)}

<div className="container mt-5">
<div className="card">
<h2 className="text-center text-success mb-4">Registrar Tutor Externo</h2>
<form onSubmit={registrarTutorExterno} className="form-horizontal">
  <div className="form-group">
    <label htmlFor="nombre_Tutor" className="col-sm-2 control-label">Nombre del Tutor</label>
    <div className="col-sm-10">
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
  </div>

  <div className="form-group">
    <label htmlFor="telefono_Tutor" className="col-sm-2 control-label">Teléfono del Tutor</label>
    <div className="col-sm-10">
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
  </div>

  <div className="form-group">
    <label htmlFor="correo_electronico_Tutor" className="col-sm-2 control-label">Correo Electrónico del Tutor</label>
    <div className="col-sm-10">
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
  </div>

  <div className="form-group">
    <div className="col-sm-offset-2 col-sm-10">
      <button type="submit" className="btn btn-primary btn-block">Registrar Tutor</button>
    </div>
  </div>
</form>
    </div>
  </div>



    </div>
    </>
  );
}

export default DashboardDirector;
