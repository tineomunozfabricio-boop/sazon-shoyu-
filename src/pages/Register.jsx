import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./Auth.css";
import session from '../Imagenes/session.jpeg'

export default function Register() {
  const navigate = useNavigate();
  const { register, db } = useApp();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmar: "",
  });
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const res = register(form);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate("/");
  }

  return (
    <div className="page">
      <div className="auth-topbar">
        <Link to="/" className="auth-topbar__mark">
          +
        </Link>
      </div>

      <div className="auth auth--reverse">
        <div className="auth__image">
          <img
            src={session}
            alt="Selección de sushi y platos nikkei"
          />
        </div>

        <div className="auth__panel">
          <Link to="/" className="auth__brand">
            Sazón &amp; Shoyu
          </Link>
          <p className="auth__tag">Cocina nikkei · Bistro-Lima</p>

          <h1 className="auth__title">Únete a nuestra mesa</h1>

          {error && <p className="auth__error">{error}</p>}

          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="auth__grid">
              <label className="field">
                Nombre
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Apellido
                <input
                  type="text"
                  value={form.apellido}
                  onChange={(e) => set("apellido", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field">
              Correo Electrónico
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </label>

            <label className="field">
              Teléfono
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                required
              />
            </label>

            <div className="auth__grid">
              <label className="field">
                Contraseña
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Confirmar contraseña
                <input
                  type="password"
                  value={form.confirmar}
                  onChange={(e) => set("confirmar", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="auth__checkbox">
              <input type="checkbox" required />
              Acepto los{" "}
              <Link to="#" className="auth__link">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link to="#" className="auth__link">
                política de privacidad
              </Link>{" "}
              de Sazón &amp; Shoyu
            </label>

            <button type="submit" className="btn btn-primary btn-block">
              Crear Cuenta
            </button>

            <p className="auth__hint">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="auth__link">
                Inicia Sesión
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
