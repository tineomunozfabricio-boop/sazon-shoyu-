import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./Contacto.css";

export default function Contacto() {
  const { addMessage, db, currentUser } = useApp();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nombre: currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : "",
    email: currentUser?.email ?? "",
    mensaje: "",
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addMessage(form);
    setSent(true);
  }

  const { direccion, telefono, email, horarios } = db.settings;

  return (
    <div className="page">
      <Navbar />

      <section className="contact container">
        <div className="contact__copy">
          <p className="eyebrow">Contacto</p>
          <h1 className="contact__title">
            Hablemos <span className="accent-italic">de tu visita</span>
          </h1>
          <p className="contact__text">
            ¿Preguntas sobre el menú, eventos privados o reservas para
            grupos? Escríbenos y te respondemos en menos de 24 horas.
          </p>

          <div className="contact__info">
            <div>
              <p className="contact__info-label">Dirección</p>
              <p>{direccion}</p>
            </div>
            <div>
              <p className="contact__info-label">Teléfono</p>
              <p>{telefono}</p>
            </div>
            <div>
              <p className="contact__info-label">Correo</p>
              <p>{email}</p>
            </div>
            <div>
              <p className="contact__info-label">Horario</p>
              <p>Mar – Dom · {horarios.Lunes.rango}</p>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          {sent ? (
            <p className="contact__sent">
              Gracias por escribirnos. Te responderemos muy pronto.
            </p>
          ) : (
            <>
              <label className="field">
                Nombre
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Correo electrónico
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Mensaje
                <textarea
                  rows={5}
                  placeholder="Cuéntanos en qué te ayudamos"
                  value={form.mensaje}
                  onChange={(e) => set("mensaje", e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block">
                Enviar mensaje
              </button>
            </>
          )}
        </form>
      </section>

      <Footer />
    </div>
  );
}
