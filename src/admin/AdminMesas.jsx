import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

const TURNOS = [
  { label: "Almuerzo 12:30", pct: 92 },
  { label: "Tarde 15:00", pct: 45 },
  { label: "Noche 19:00", pct: 78 },
  { label: "Noche 21:00", pct: 60 },
];

export default function AdminMesas() {
  const { db, cycleTableStatus } = useApp();

  const libres = db.tables.filter((t) => t.estado === "Libre").length;
  const ocupadas = db.tables.length - libres;

  return (
    <AdminLayout title="Mesas">
      <p className="admin-tables-summary">
        {libres} libres - {ocupadas} Ocupadas - {db.tables.length} Total
      </p>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <p className="eyebrow" style={{ marginBottom: "1rem" }}>
          Mapa del Salon -- Clic para cambiar estado
        </p>
        <div className="admin-tables-grid">
          {db.tables.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-table-cell admin-table-cell--${t.estado.toLowerCase()}`}
              onClick={() => cycleTableStatus(t.id)}
            >
              <span className="admin-table-cell__icon">{t.estado === "Libre" ? "🛋" : "👥"}</span>
              <strong>{t.nombre}</strong>
              <br />
              {t.estado}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <p className="eyebrow" style={{ marginBottom: "1rem" }}>
          Ocupación por Turno
        </p>
        {TURNOS.map((t) => (
          <div key={t.label} className="admin-progress-row">
            <span>{t.label}</span>
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: `${t.pct}%` }} />
            </div>
            <span>{t.pct}%</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
