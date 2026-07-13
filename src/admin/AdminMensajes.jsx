import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function AdminMensajes() {
  const { db, toggleMessageRead, deleteMessage } = useApp();

  function handleDelete(id) {
    if (window.confirm("¿Eliminar este mensaje? Esta acción no se puede deshacer.")) {
      deleteMessage(id);
    }
  }

  return (
    <AdminLayout title="Mensajes">
      <div className="admin-card">
        {db.messages.length === 0 && (
          <p className="admin-empty">
            Todavía no hay mensajes. Aparecerán aquí cuando alguien escriba desde el formulario de
            Contacto del sitio.
          </p>
        )}
        {db.messages.map((m) => (
          <div key={m.id} className="admin-list-row" style={{ alignItems: "flex-start" }}>
            <div className="admin-list-row__main" style={{ alignItems: "flex-start" }}>
              <div>
                <p className="admin-list-row__name">
                  {m.nombre} {!m.leido && <span className="admin-badge admin-badge--pendiente">Nuevo</span>}
                </p>
                <p className="admin-list-row__sub">{m.email}</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{m.mensaje}</p>
                <p style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--gold)" }}>
                  {new Date(m.fecha).toLocaleString("es-PE")}
                </p>
              </div>
            </div>
            <div className="admin-actions-cell">
              <button type="button" className="admin-btn" onClick={() => toggleMessageRead(m.id)}>
                {m.leido ? "Marcar no leído" : "Marcar leído"}
              </button>
              <button
                type="button"
                className="admin-icon-btn danger"
                onClick={() => handleDelete(m.id)}
                title="Eliminar mensaje"
              >
                ⊘
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
