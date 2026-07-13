import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

const TABS = ["Todas", "Confirmadas", "Pendientes", "Canceladas"];
const ESTADOS = ["Confirmada", "Pendiente", "Cancelada"];

export default function AdminReservas() {
  const { db, addReservation, updateReservationStatus, deleteReservation } = useApp();
  const [tab, setTab] = useState("Todas");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    hora: "19:00",
    personas: 2,
    experiencia: "",
    estado: "Pendiente",
  });

  const filtered = useMemo(() => {
    if (tab === "Todas") return db.reservations;
    const map = { Confirmadas: "Confirmada", Pendientes: "Pendiente", Canceladas: "Cancelada" };
    return db.reservations.filter((r) => r.estado === map[tab]);
  }, [db.reservations, tab]);

  function openNew() {
    setEditing(null);
    setForm({ nombre: "", email: "", telefono: "", hora: "19:00", personas: 2, experiencia: "", estado: "Pendiente" });
    setShowModal(true);
  }

  function openEdit(r) {
    setEditing(r.id);
    setForm({ ...r });
    setShowModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (editing) {
      updateReservationStatus(editing, form.estado);
    } else {
      addReservation({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        fecha: new Date().toISOString().slice(0, 10),
        hora: form.hora,
        personas: Number(form.personas),
        experiencia: form.experiencia,
        estado: form.estado,
      });
    }
    setShowModal(false);
  }

  return (
    <AdminLayout title="Reservas">
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? "is-active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
          + Nueva Reserva
        </button>
      </div>

      <div className="admin-card">
        {filtered.length === 0 && <p className="admin-empty">No hay reservas en esta categoría.</p>}
        {filtered.map((r) => (
          <div key={r.id} className="admin-list-row">
            <div className="admin-list-row__main">
              <span className="admin-list-row__time">{r.hora}</span>
              <div>
                <p className="admin-list-row__name">{r.nombre}</p>
                <p className="admin-list-row__sub">
                  {r.personas} persona{r.personas > 1 ? "s" : ""} - {r.experiencia || "Carta"}
                </p>
              </div>
            </div>
            <div className="admin-actions-cell">
              <span className={`admin-badge admin-badge--${r.estado.toLowerCase()}`}>{r.estado}</span>
              <button type="button" className="admin-icon-btn" onClick={() => openEdit(r)} title="Editar">
                ✎
              </button>
              <button
                type="button"
                className="admin-icon-btn danger"
                onClick={() => deleteReservation(r.id)}
                title="Eliminar"
              >
                ⊘
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Editar reserva" : "Nueva reserva"}</h3>
            <form onSubmit={handleSave}>
              {!editing && (
                <>
                  <div className="admin-form-grid">
                    <label>
                      Nombre
                      <input
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Teléfono
                      <input
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                  <div className="admin-form-grid">
                    <label>
                      Correo
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Hora
                      <input
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                  <div className="admin-form-grid">
                    <label>
                      Personas
                      <input
                        type="number"
                        min="1"
                        value={form.personas}
                        onChange={(e) => setForm({ ...form, personas: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Experiencia
                      <input
                        value={form.experiencia}
                        onChange={(e) => setForm({ ...form, experiencia: e.target.value })}
                        placeholder="Omakase, Carta..."
                      />
                    </label>
                  </div>
                </>
              )}
              <label className="admin-field" style={{ marginBottom: "1.2rem" }}>
                Estado
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  {ESTADOS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-save-bar">
                <button type="button" className="admin-btn" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
