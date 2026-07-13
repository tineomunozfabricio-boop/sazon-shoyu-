import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import "./Admin.css";

const NAV = [
  {
    group: "Gestión",
    items: [
      { to: "/admin/reservas", label: "Reservas", icon: "🗓" },
      { to: "/admin/clientes", label: "Clientes", icon: "👥" },
      { to: "/admin/menu", label: "Menu", icon: "🍴" },
      { to: "/admin/mesas", label: "Mesas", icon: "🪑" },
      { to: "/admin/mensajes", label: "Mensajes", icon: "✉" },
    ],
  },
  {
    group: "Análisis",
    items: [{ to: "/admin/estadisticas", label: "Estadísticas", icon: "📊" }],
  },
  {
    group: "Sistema",
    items: [{ to: "/admin/configuraciones", label: "Configuraciones", icon: "⚙" }],
  },
];

export default function AdminLayout({ title, children }) {
  const { currentUser, isAdmin, logout, db } = useApp();
  const navigate = useNavigate();

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const initials = `${currentUser.nombre?.[0] ?? ""}${currentUser.apellido?.[0] ?? ""}`.toUpperCase();
  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long" });
  const normalizar = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const horarioHoy =
    Object.entries(db.settings.horarios).find(
      ([dia]) => normalizar(dia) === normalizar(hoy)
    )?.[1] ?? null;

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          {db.settings.logoUrl && (
            <img
              src={db.settings.logoUrl}
              alt="Logo"
              style={{ height: 34, width: 34, borderRadius: "50%", objectFit: "cover", marginBottom: 6 }}
            />
          )}
          <p className="admin__brand-title">Sazón &amp; Shoyu</p>
          <p className="admin__brand-sub">Panel Admin</p>
        </div>

        <nav className="admin__nav">
          {NAV.map((section) => (
            <div key={section.group} className="admin__nav-group">
              <p className="admin__nav-label">{section.group}</p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    "admin__nav-item" + (isActive ? " is-active" : "")
                  }
                >
                  <span className="admin__nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="admin__user" onClick={handleLogout} title="Cerrar sesión">
          <span className="admin__avatar">{initials || "AD"}</span>
          <span>
            <span className="admin__user-name">
              {currentUser.nombre} {currentUser.apellido}
            </span>
            <span className="admin__user-role">Administrador · Salir</span>
          </span>
        </button>
      </aside>

      <main className="admin__main">
        <header className="admin__topbar">
          <h1 className="admin__title">{title}</h1>
          <div className="admin__topbar-actions">
            <span className="admin__status-pill">
              👁 {horarioHoy?.abierto ? "Abierto" : "Cerrado"}
              {horarioHoy ? ` -- ${horarioHoy.rango}` : ""}
            </span>
            <span className="admin__bell">🔔</span>
          </div>
        </header>

        <div className="admin__content">{children}</div>
      </main>
    </div>
  );
}
