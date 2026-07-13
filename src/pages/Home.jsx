import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./Home.css";
import inicio from '../Imagenes/Inicio.jpeg';

export default function Home() {
  const { db } = useApp();

  return (
    <div className="page">
      <Navbar />

      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Lima · Cocina de fusión</p>
          
          <h1 className="hero__title">
            Sazón <span className="accent-italic">&amp; Shoyu</span>
          </h1>

          {/* Separador decorativo */}
          <div className="hero__divider"></div>

          <p className="hero__subtitle">
            Auténtica cocina japonesa, preparada con pasión.
          </p>

          <p className="hero__text">
            Explora la verdadera esencia de la cocina Nikkei. En Sazón &amp;
            Shoyu combinamos ingredientes frescos y técnicas milenarias para
            llevar a tu mesa el equilibrio perfecto entre el sabor de la
            tradición peruana y el umami japonés. Reserva tu mesa y vive la
            fusión.
          </p>

          <Link to="/reservar" className="btn btn-primary">
            Reserva tu mesa
          </Link>
        </div>

        <div className="hero__image">
          <img
            src={inicio}
            alt="Plato nikkei de Sazón & Shoyu servido con flores"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}