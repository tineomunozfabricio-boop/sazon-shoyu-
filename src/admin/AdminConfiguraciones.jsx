import { useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

const DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminConfiguraciones() {
  const { db, updateSettings, updateHorario } = useApp();
  const [form, setForm] = useState(db.settings);
  const [saved, setSaved] = useState(false);

  function handleField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, logoUrl: dataUrl }));
    setSaved(false);
  }

  async function handleHero(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, heroImageUrl: dataUrl }));
    setSaved(false);
  }

  function handleSave() {
    updateSettings(form);
    setSaved(true);
  }

  return (
    <AdminLayout title="Configuraciones">
      <div className="admin-settings-section">
        <h3>Información del restaurante</h3>
        <div className="admin-form-grid">
          <label>
            Nombre
            <input value={form.nombreRestaurante} onChange={(e) => handleField("nombreRestaurante", e.target.value)} />
          </label>
          <label>
            Teléfono
            <input value={form.telefono} onChange={(e) => handleField("telefono", e.target.value)} />
          </label>
          <label>
            Email
            <input value={form.email} onChange={(e) => handleField("email", e.target.value)} />
          </label>
          <label>
            Dirección
            <input value={form.direccion} onChange={(e) => handleField("direccion", e.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-settings-section">
        <h3>Horarios de Atención</h3>
        {DIAS.map((dia) => {
          const h = db.settings.horarios[dia];
          return (
            <div key={dia} className="admin-day-row">
              <span>{dia}</span>
              <button
                type="button"
                className={`admin-toggle ${h.abierto ? "is-abierto" : "is-cerrado"}`}
                onClick={() => updateHorario(dia, { abierto: !h.abierto })}
              >
                {h.abierto ? "Abierto" : "Cerrado"}
              </button>
              <input
                type="text"
                value={h.rango}
                onChange={(e) => updateHorario(dia, { rango: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      <div className="admin-save-bar">
        {saved && <span style={{ alignSelf: "center", color: "var(--success)" }}>Guardado ✓</span>}
        <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </AdminLayout>
  );
}
