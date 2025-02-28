import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const Altas = () => {
  const navigate = useNavigate(); // Hook para navegación
  const [formData, setFormData] = useState({
    puestoTrabajo: "",
    area: "",
    nombrePuesto: "",
    objetivoPuesto: "",
    actividadesEtapas: "",
    cuatrimestre: "Primero",
    asignatura: "",
    unidadAprendizaje: "",
    resultadoAprendizaje: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/registrar-alta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al registrar el alta");

      alert("Alta registrada correctamente");

      // Redirigir automáticamente al panel anterior
      navigate("/tutorInterno");
    } catch (error) {
      console.error("Error:", error);
      setError("Error al registrar el alta.");
    }
  };

  return (
    <div>
      <h2>Registrar Alta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Puesto de Trabajo:</label>
        <input type="text" name="puestoTrabajo" value={formData.puestoTrabajo} onChange={handleChange} required />

        <label>Área:</label>
        <input type="text" name="area" value={formData.area} onChange={handleChange} required />

        <label>Nombre del Puesto:</label>
        <input type="text" name="nombrePuesto" value={formData.nombrePuesto} onChange={handleChange} required />

        <label>Objetivo del Puesto:</label>
        <textarea name="objetivoPuesto" value={formData.objetivoPuesto} onChange={handleChange} required />

        <label>Actividades y Etapas:</label>
        <textarea name="actividadesEtapas" value={formData.actividadesEtapas} onChange={handleChange} required />

        <label>Cuatrimestre a cursar:</label>
        <select name="cuatrimestre" value={formData.cuatrimestre} onChange={handleChange}>
          {["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Asignatura:</label>
        <input type="text" name="asignatura" value={formData.asignatura} onChange={handleChange} required />

        <label>Unidad de Aprendizaje:</label>
        <input type="number" name="unidadAprendizaje" value={formData.unidadAprendizaje} onChange={handleChange} required />

        <label>Resultado de Aprendizaje:</label>
        <textarea name="resultadoAprendizaje" value={formData.resultadoAprendizaje} onChange={handleChange} required />

        <button type="submit">Registrar Alta</button>
      </form>
    </div>
  );
};

export default Altas;
