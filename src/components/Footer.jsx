import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { db } = useApp();
  const { direccion, email, telefono } = db.settings;

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <p className="footer__title">
            {db.settings.logoUrl && (
              <img
                src={db.settings.logoUrl}
                alt="Logo"
                style={{ height: 28, width: 28, borderRadius: "50%", objectFit: "cover", marginRight: 8, verticalAlign: "middle" }}
              />
            )}
            Sazón &amp; Shoyu
          </p>
          <p className="footer__tag">
            Cocina de fusión peruana-japonesa
            <br />
            en el corazón de Miraflores, Lima.
          </p>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Navegación</p>
          <Link to="/">Inicio</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/menu">Menú</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Nuestras redes</p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
            <a href="#" aria-label="Twitter">
              ✕
            </a>
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Contactos</p>
          <p>{direccion}</p>
          <p>{email}</p>
          <p>{telefono}</p>
        </div>
      </div>
      <p className="footer__bottom">© 2026 Sazón &amp; Shoyu · Lima, Perú</p>
    </footer>
  );
}
