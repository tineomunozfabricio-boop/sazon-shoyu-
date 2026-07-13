import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

const TABS = ["Todos", "Entrada", "Principales", "Postres"];

export default function AdminMenu() {
  const { db, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [tab, setTab] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", categoria: "Entrada", precio: "", desc: "" });

  const filtered = useMemo(
    () => (tab === "Todos" ? db.menuItems : db.menuItems.filter((m) => m.categoria === tab)),
    [db.menuItems, tab]
  );

  function openNew() {
    setEditing(null);
    setForm({ nombre: "", categoria: "Entrada", precio: "", desc: "" });
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({ nombre: item.nombre, categoria: item.categoria, precio: item.precio, desc: item.desc || "" });
    setShowModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const payload = { ...form, precio: Number(form.precio) };
    if (editing) {
      updateMenuItem(editing, payload);
    } else {
      addMenuItem(payload);
    }
    setShowModal(false);
  }

  return (
    <AdminLayout title="Menú">
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} type="button" className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
              {t === "Entrada" ? "Entrada" : t}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
          + Añadir plato
        </button>
      </div>

      <div className="admin-card">
        {filtered.length === 0 && <p className="admin-empty">No hay platos en esta categoría todavía.</p>}
        {filtered.map((item) => (
          <div key={item.id} className="admin-list-row">
            <div className="admin-list-row__main">
              <span style={{ color: item.disponible ? "#6b8e5a" : "#c15c53" }}>●</span>
              <div>
                <p className="admin-list-row__name">{item.nombre}</p>
                <p className="admin-list-row__sub">{item.categoria}</p>
              </div>
            </div>
            <div className="admin-actions-cell">
              <span>${item.precio}</span>
              <span
                className={`admin-badge admin-badge--${item.disponible ? "disponible" : "agotado"}`}
                style={{ cursor: "pointer" }}
                onClick={() => updateMenuItem(item.id, { disponible: !item.disponible })}
                title="Click para cambiar disponibilidad"
              >
                {item.disponible ? "Disponible" : "Agotado"}
              </span>
              <button type="button" className="admin-icon-btn" onClick={() => openEdit(item)} title="Editar">
                ✎
              </button>
              <button
                type="button"
                className="admin-icon-btn danger"
                onClick={() => deleteMenuItem(item.id)}
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
            <h3>{editing ? "Editar plato" : "Añadir plato"}</h3>
            <form onSubmit={handleSave}>
              <label className="admin-field" style={{ marginBottom: "1rem" }}>
                Nombre del plato
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </label>
              <div className="admin-form-grid">
                <label>
                  Categoría
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Principales">Principales</option>
                    <option value="Postres">Postres</option>
                  </select>
                </label>
                <label>
                  Precio (S/)
                  <input
                    type="number"
                    min="0"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </label>
              </div>
              <label className="admin-field" style={{ marginBottom: "1.2rem" }}>
                Descripción
                <textarea
                  rows={3}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
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
