import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./Auth.css";
import session from '../Imagenes/session.jpeg'


export default function Login() {
  const navigate = useNavigate();
  const { login, db } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate(res.role === "admin" ? "/admin/reservas" : "/");
  }

  return (
    <div className="page">
      <div className="auth-topbar">
        <Link to="/" className="auth-topbar__mark">
          +
        </Link>
      </div>

      <div className="auth">
        <div className="auth__panel">
          <Link to="/" className="auth__brand">
            Sazón &amp; Shoyu
          </Link>
          <p className="auth__tag">Cocina nikkei · Bistro-Lima</p>

          <h1 className="auth__title">Bienvenido de Vuelta</h1>

          {error && <p className="auth__error">{error}</p>}

          <form className="auth__form" onSubmit={handleSubmit}>
            <label className="field">
              Correo electrónico:
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="field">
              Contraseña:
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="auth__row">
              <label className="auth__checkbox">
                <input type="checkbox" />
                Recordar contraseña
              </label>
              <Link to="#" className="auth__link">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="btn btn-outline btn-block">
              Iniciar Sesión
            </button>

            <div className="auth__divider">¿Primera vez aquí?</div>

            <p className="auth__hint">
              <Link to="/registro" className="auth__link">
                Crea tu cuenta en Sazón y Shoyu
              </Link>
            </p>

            <Link to="/registro" className="btn btn-primary btn-block">
              Registrarse
            </Link>
          </form>
        </div>

        <div className="auth__image">
          <img
            src={session}
            alt="Selección de sushi y platos nikkei"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
