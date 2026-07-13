import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import "./Admin.css";

export default function AdminLogin() {
  const { login, currentUser, isAdmin, db } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser && isAdmin) {
    return <Navigate to="/admin/reservas" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (res.role !== "admin") {
      setError("Esta cuenta no tiene acceso al panel admin.");
      return;
    }
    navigate("/admin/reservas");
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        {db.settings.logoUrl && (
          <img
            src={db.settings.logoUrl}
            alt="Logo"
            style={{ height: 48, width: 48, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
          />
        )}
        <p className="admin-login__brand">Sazón &amp; Shoyu</p>
        <p className="eyebrow">Panel Admin</p>
        <h1 className="admin-login__title">Acceso administrador</h1>

        {error && <p className="admin-login__error">{error}</p>}

        <label className="admin-login__field">
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sazonshoyu.pe"
            required
          />
        </label>
        <label className="admin-login__field">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block">
          Ingresar
        </button>

        <p className="admin-login__hint">
          Demo: admin@sazonshoyu.pe / admin123
        </p>
        <Link to="/" className="admin-login__back">
          ← Volver al sitio
        </Link>
      </form>
    </div>
  );
}
