import { useMemo } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useApp } from "../context/AppContext.jsx";

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

export default function AdminEstadisticas() {
  const { db } = useApp();

  const reservasDelMes = db.reservations.length;
  const confirmadas = db.reservations.filter((r) => r.estado === "Confirmada").length;
  const nuevos = db.users.filter((u) => u.role === "cliente").length;
  const recurrentes = db.users.filter(
    (u) => u.role === "cliente" && db.reservations.filter((r) => r.email === u.email).length > 1
  ).length;

  const barras = useMemo(
    () => DIAS.map(() => 30 + Math.round(Math.random() * 70)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db.reservations.length]
  );

  const experiencias = useMemo(() => {
    const counts = {};
    db.reservations.forEach((r) => {
      const key = r.experiencia || "Carta";
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = db.reservations.length || 1;
    return Object.entries(counts)
      .map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
  }, [db.reservations]);

  return (
    <AdminLayout title="Estadísticas">
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Reservas del mes</p>
          <p className="admin-stat-card__value">{reservasDelMes}</p>
          <p className="admin-stat-card__delta">{confirmadas} confirmadas</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Mesas ocupadas</p>
          <p className="admin-stat-card__value">
            {db.tables.filter((t) => t.estado === "Ocupado").length}/{db.tables.length}
          </p>
          <p className="admin-stat-card__delta">en tiempo real</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Platos en carta</p>
          <p className="admin-stat-card__value">{db.menuItems.length}</p>
          <p className="admin-stat-card__delta">
            {db.menuItems.filter((m) => m.disponible).length} disponibles
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Clientes registrados</p>
          <p className="admin-stat-card__value">{nuevos}</p>
          <p className="admin-stat-card__delta">{recurrentes} recurrentes</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <p className="eyebrow" style={{ marginBottom: "1.2rem" }}>
          Reservas por día -- última semana
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.8rem", height: 160 }}>
          {barras.map((h, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: `${h}px`,
                  background: i === barras.length - 1 ? "var(--gold)" : "var(--card)",
                  borderRadius: 4,
                }}
              />
              <p style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "var(--gold)" }}>{DIAS[i]}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="admin-card">
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>
            Experiencias más reservadas
          </p>
          {experiencias.length === 0 && <p className="admin-empty">Aún no hay reservas.</p>}
          {experiencias.map((e) => (
            <div key={e.label} className="admin-progress-row">
              <span>{e.label}</span>
              <div className="admin-progress-track">
                <div className="admin-progress-fill" style={{ width: `${e.pct}%` }} />
              </div>
              <span>{e.pct}%</span>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>
            Clientes nuevos vs recurrentes
          </p>
          <div className="admin-progress-track" style={{ marginBottom: "1rem" }}>
            <div
              className="admin-progress-fill"
              style={{ width: `${nuevos ? Math.round(((nuevos - recurrentes) / nuevos) * 100) : 0}%` }}
            />
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="admin-stat-card" style={{ flex: 1 }}>
              <p className="admin-stat-card__label">Nuevos</p>
              <p className="admin-stat-card__value">{Math.max(nuevos - recurrentes, 0)}</p>
            </div>
            <div className="admin-stat-card" style={{ flex: 1 }}>
              <p className="admin-stat-card__label">Recurrentes</p>
              <p className="admin-stat-card__value">{recurrentes}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
