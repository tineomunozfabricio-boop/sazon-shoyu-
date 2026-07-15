import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import "./MisReservas.css";

export default function MisReservas() {
  const { db, currentUser, updateReservationStatus } = useApp();

  const misReservas = useMemo(() => {
    if (!currentUser) return [];
    return db.reservations
      .filter((r) => r.email.toLowerCase() === currentUser.email.toLowerCase())
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [db.reservations, currentUser]);

  if (!currentUser) {
    return (
      <div className="page">
        <Navbar />
        <section className="myres myres--empty container">
          <p className="eyebrow">Mis Reservas</p>
          <h1 className="myres__title">
            Inicia sesión para ver <span className="accent-italic">tus reservas</span>
          </h1>
          <p className="myres__text">
            Crea una cuenta o inicia sesión para consultar el estado de tus
            reservas y cancelarlas cuando lo necesites.
          </p>
          <div className="myres__actions">
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="btn btn-outline">
              Crear cuenta
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <section className="myres container">
        <div className="myres__head">
          <div>
            <p className="eyebrow">Mis Reservas</p>
            <h1 className="myres__title">
              Hola {currentUser.nombre}, <span className="accent-italic">esto es lo tuyo</span>
            </h1>
          </div>
          <Link to="/reservar" className="btn btn-primary">
            + Nueva reserva
          </Link>
        </div>

        {misReservas.length === 0 ? (
          <div className="myres__empty-state">
            <p>Todavía no tienes reservas.</p>
            <Link to="/reservar" className="auth__link">
              Haz tu primera reserva →
            </Link>
          </div>
        ) : (
          <div className="myres-list">
            {misReservas.map((r) => (
              <div key={r.id} className="myres-card">
                <div className="myres-card__date">
                  <p className="myres-card__day">
                    {r.fecha ? r.fecha.split("-").reverse().join("/") : "—"}
                  </p>
                  <p className="myres-card__time">{r.hora}</p>
                </div>

                <div className="myres-card__main">
                  <p className="myres-card__dish">{r.experiencia || "Carta"}</p>
                  <p className="myres-card__meta">
                    {r.personas} persona{r.personas > 1 ? "s" : ""}
                  </p>
                </div>

                <span className={`myres-badge myres-badge--${r.estado.toLowerCase()}`}>
                  {r.estado}
                </span>

                {r.estado !== "Cancelada" ? (
                  <button
                    type="button"
                    className="btn btn-outline myres-card__cancel"
                    onClick={() => updateReservationStatus(r.id, "Cancelada")}
                  >
                    Cancelar
                  </button>
                ) : (
                  <span className="myres-card__cancelled-note">
                    Reserva cancelada
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
