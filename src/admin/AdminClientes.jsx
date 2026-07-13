import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function AdminClientes() {
  const { db, deleteUser } = useApp();
  const [query, setQuery] = useState("");

  const clientes = useMemo(() => {
    const soloClientes = db.users.filter((u) => u.role === "cliente");
    return soloClientes.map((c) => {
      const misReservas = db.reservations.filter(
        (r) => r.email.toLowerCase() === c.email.toLowerCase()
      );
      const ultima = misReservas[0]?.fecha ?? "—";
      return {
        ...c,
        visitas: misReservas.length,
        ultima,
      };
    });
  }, [db.users, db.reservations]);

  const filtrados = clientes.filter((c) =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(query.toLowerCase())
  );

  function exportar() {
    const rows = [
      ["Nombre", "Correo", "Teléfono", "Visitas", "Última reserva"],
      ...filtrados.map((c) => [`${c.nombre} ${c.apellido}`, c.email, c.telefono, c.visitas, c.ultima]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-sazon-shoyu.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDelete(c) {
    const ok = window.confirm(
      `¿Eliminar a ${c.nombre} ${c.apellido}? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    const res = deleteUser(c.id);
    if (!res.ok) {
      alert(res.error || "No se pudo eliminar el usuario.");
    }
  }

  return (
    <AdminLayout title="Clientes">
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Buscar por nombre del cliente"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="admin-btn" onClick={exportar}>
          Exportar
        </button>
      </div>

      <div className="admin-card">
        {filtrados.length === 0 && (
          <p className="admin-empty">
            {clientes.length === 0
              ? "Todavía no hay clientes registrados. Aparecerán aquí cuando alguien cree una cuenta."
              : "No se encontraron clientes con ese nombre."}
          </p>
        )}
        {filtrados.map((c) => (
          <div key={c.id} className="admin-list-row">
            <div className="admin-list-row__main">
              <span className="admin-avatar-sm">
                {(c.nombre?.[0] ?? "").toUpperCase()}
                {(c.apellido?.[0] ?? "").toUpperCase()}
              </span>
              <div>
                <p className="admin-list-row__name">
                  {c.nombre} {c.apellido}
                </p>
                <p className="admin-list-row__sub">{c.email}</p>
              </div>
            </div>
            <div className="admin-actions-cell">
              <span>{c.visitas} Visitas</span>
              <span>Última: {c.ultima}</span>
              <button
                type="button"
                className="admin-icon-btn danger"
                onClick={() => handleDelete(c)}
                title="Eliminar cliente"
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
