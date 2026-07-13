import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { galleryThumbs } from "../data/menu.js";
import { useApp } from "../context/AppContext.jsx";
import "./Menu.css";
import menu from '../Imagenes/menu.jpeg'

const CATEGORIAS = ["Entrada", "Principales", "Postres"];
const TITULOS = {
  Entrada: "Entradas & Fusión",
  Principales: "Fondos & Principales",
  Postres: "Postres",
};

export default function Menu() {
  const { db } = useApp();
  const navigate = useNavigate();

  const columnas = CATEGORIAS.map((cat) => ({
    title: TITULOS[cat],
    items: db.menuItems.filter((m) => m.categoria === cat),
  })).filter((c) => c.items.length > 0);

  const mitad = Math.ceil(columnas.length / 2) || 1;
  const colIzq = columnas.slice(0, mitad);
  const colDer = columnas.slice(mitad);

  return (
    <div className="page">
      <Navbar />

      <section className="menu-intro container">
        <div className="menu-intro__copy">
          <p className="eyebrow">Nuestra Menú</p>
          <h1 className="menu-intro__title">
            La carta de <br />
            Sazón <span className="accent-italic">&amp; Shoyu</span>
          </h1>
          <p className="menu-intro__text">
            Cada plato es un diálogo entre dos tradiciones culinarias que se
            complementan en perfecta armonía. Ingredientes del Perú con
            técnica japonesa.
          </p>
        </div>
        <div className="menu-intro__image">
          <img
            src={menu}
            alt="Plato de salmón glaseado con hierbas"
          />
        </div>
      </section>

      <div className="menu-gallery">
  <Swiper
  modules={[Autoplay]}
  loop={true}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
  }}
  speed={5000}
  slidesPerView={"auto"}
  spaceBetween={20}
  allowTouchMove={false}
>
    {galleryThumbs.map((src, index) => (
      <SwiperSlide key={index}>
        <img
  src={src.img}
  alt={`Plato ${index + 1}`}
  className="menu-gallery__img"
  role="button"
  tabIndex={0}
  onClick={() => navigate("/reservar")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") navigate("/reservar");
  }}
/>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

      <section className="container menu-list">
        <h2 className="menu-list__heading">Platos más populares</h2>
        <div className="menu-list__grid">
          <div className="menu-list__col">
            {colIzq.map((col) => (
              <div key={col.title}>
                <p className="eyebrow menu-list__col-title">{col.title}</p>
                {col.items.map((item) => (
                  <div key={item.id} className="menu-list__item">
                    <p className="menu-list__item-name">
                      {item.nombre}
                      {!item.disponible && (
                        <span style={{ color: "#c15c53", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                          (Agotado)
                        </span>
                      )}
                      <span style={{ float: "right", color: "var(--gold)" }}>S/ {item.precio}</span>
                    </p>
                    <p className="menu-list__item-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="menu-list__col">
            {colDer.map((col) => (
              <div key={col.title}>
                <p className="eyebrow menu-list__col-title menu-list__col-title--spaced">{col.title}</p>
                {col.items.map((item) => (
                  <div key={item.id} className="menu-list__item">
                    <p className="menu-list__item-name">
                      {item.nombre}
                      {!item.disponible && (
                        <span style={{ color: "#c15c53", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                          (Agotado)
                        </span>
                      )}
                      <span style={{ float: "right", color: "var(--gold)" }}>S/ {item.precio}</span>
                    </p>
                    <p className="menu-list__item-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
