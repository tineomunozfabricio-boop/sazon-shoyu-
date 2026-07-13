import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import "./Navbar.css";
import iconrestaurant from '../Imagenes/iconrestaurant.png'
const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/menu", label: "Menú" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar({ variant = "light" }) {
  const { db, currentUser, isAdmin, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className={`navbar navbar--${variant}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          {db.settings.logoUrl ? (
            <img src={db.settings.logoUrl} alt="Logo" className="navbar__logo" />
          ) : (
            <span className="navbar__mark">
              <img src={iconrestaurant} alt="" />
            </span>
          )}
          <span className="navbar__brand-text">Sazón &amp; Shoyu</span>
        </Link>

        <nav className="navbar__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " is-active" : "")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {currentUser ? (
            <>
              {isAdmin && (
                <Link to="/admin/reservas" className="navbar__ghost">
                  Panel Admin
                </Link>
              )}
              <span className="navbar__ghost">Hola, {currentUser.nombre}</span>
              <button type="button" className="btn btn-primary navbar__cta" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <span className="navbar__user-icon" aria-hidden="true">
                ⛩
              </span>
              <Link to="/login" className="navbar__ghost">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn btn-primary navbar__cta">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
