import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { featuredDishes, timeSlots } from "../data/menu.js";
import { useApp } from "../context/AppContext.jsx";
import "./Reservation.css";
import Reserva from '../Imagenes/Reserva.jpeg'

const STEPS = [
  { key: 1, label: "Cuando" },
  { key: 2, label: "Fecha" },
  { key: 3, label: "Confirmar" },
];

const WEEKDAYS = ["D", "L", "M", "M", "J", "V", "S"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function Reservation() {
  const { addReservation, currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [dish, setDish] = useState(featuredDishes[0].id);
  const [time, setTime] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(6); // Julio (0-indexed)
  const [selectedDay, setSelectedDay] = useState(null);

  const [name, setName] = useState(currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : "");
  const [phone, setPhone] = useState(currentUser?.telefono?.replace("+51", "").trim() ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");

  const cells = useMemo(
    () => buildCalendar(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const dishLabel =
    featuredDishes.find((d) => d.id === dish)?.name ?? "";

  const dateLabel = selectedDay
    ? `${String(selectedDay).padStart(2, "0")}/${String(
        viewMonth + 1
      ).padStart(2, "0")}/${viewYear}`
    : "—";

  function goPrevMonth() {
    setSelectedDay(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    setSelectedDay(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleConfirm(e) {
    e.preventDefault();
    addReservation({
      nombre: name,
      email,
      telefono: `+51 ${phone}`,
      fecha: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(
        selectedDay
      ).padStart(2, "0")}`,
      hora: time,
      personas: quantity,
      experiencia: dishLabel,
      estado: "Pendiente",
    });
    setStep(4);
  }

  function resetAll() {
    setStep(1);
    setDish(featuredDishes[0].id);
    setTime(null);
    setQuantity(1);
    setSelectedDay(null);
    setName("");
    setPhone("");
    setEmail("");
  }

  return (
    <div className="page">
      <Navbar />

      <section className="res-hero">
        <img src={Reserva} alt="Reserva" className="res-hero__img" />
        <div className="res-hero__overlay">
          <p className="res-hero__eyebrow">Lima · Cocina de fusión</p>
          <h1 className="res-hero__title">
            Sazón <span className="accent-italic">&amp; Shoyu</span>
          </h1>
          <p className="res-hero__sub">Perú x Asia · Dos almas, una mesa</p>
        </div>
      </section>

      <div className="res-dishes">
        {featuredDishes.map((d) => (
          <button
            key={d.id}
            className={
              "res-dish" + (dish === d.id ? " res-dish--active" : "")
            }
            onClick={() => setDish(d.id)}
            type="button"
          >
            <img src={d.img} alt={d.name} />
            <div className="res-dish__caption">
              <p className="res-dish__name">{d.name}</p>
              <p className="res-dish__tag">{d.tag}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="container res-body">
        <ol className="stepper">
          {STEPS.map((s) => (
            <li
              key={s.key}
              className={
                "stepper__item" +
                (step === s.key ? " is-active" : "") +
                (step > s.key ? " is-done" : "")
              }
            >
              <span className="stepper__dot">
                {step > s.key ? "✓" : s.key}
              </span>
              <span className="stepper__label">{s.label}</span>
            </li>
          ))}
        </ol>

        {step === 1 && (
          <div className="res-step">
            <p className="eyebrow">Turno</p>
            <div className="time-grid">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={
                    "time-slot" + (time === t ? " time-slot--active" : "")
                  }
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="eyebrow res-step__spaced">Cantidad</p>
            <div className="qty">
              <button
                type="button"
                className="qty__btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty__value">{quantity}</span>
              <button
                type="button"
                className="qty__btn"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              >
                +
              </button>
              <span className="qty__label">Personas</span>
            </div>

            <button
              type="button"
              className="btn btn-primary res-step__cta"
              disabled={!time}
              onClick={() => setStep(2)}
            >
              Elegir Experiencia →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="res-step res-step--calendar">
            <div className="calendar">
              <h2 className="calendar__title">
                Elige tu <span className="accent-italic">fecha</span>
              </h2>
              <div className="calendar__nav">
                <button type="button" onClick={goPrevMonth} aria-label="Mes anterior">
                  ‹
                </button>
                <span>
                  {MONTHS[viewMonth]}{" "}
                  <span className="accent-italic">{viewYear}</span>
                </span>
                <button type="button" onClick={goNextMonth} aria-label="Mes siguiente">
                  ›
                </button>
              </div>

              <div className="calendar__weekdays">
                {WEEKDAYS.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </div>

              <div className="calendar__grid">
                {cells.map((day, i) =>
                  day ? (
                    <button
                      key={i}
                      type="button"
                      className={
                        "calendar__day" +
                        (selectedDay === day ? " calendar__day--active" : "")
                      }
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ) : (
                    <span key={i} className="calendar__day calendar__day--empty" />
                  )
                )}
              </div>
            </div>

            <div className="res-step__actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(1)}
              >
                ← Volver
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedDay}
                onClick={() => setStep(3)}
              >
                Ver Resumen →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="res-step res-step--confirm" onSubmit={handleConfirm}>
            <div className="summary">
              <div className="summary__row">
                <span>Fecha</span>
                <strong>{dateLabel}</strong>
              </div>
              <div className="summary__row">
                <span>Hora</span>
                <strong>{time}</strong>
              </div>
              <div className="summary__row">
                <span>Comensales</span>
                <strong>{quantity} persona{quantity > 1 ? "s" : ""}</strong>
              </div>
              <div className="summary__row">
                <span>Platos</span>
                <strong>{dishLabel}</strong>
              </div>
            </div>

            <label className="field">
              Nombre completo
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <div className="auth__grid">
              <label className="field">
                Teléfono
                <div className="phone-input">
                  <span>+51</span>
                  <input
                    type="tel"
                    placeholder="987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </label>
              <label className="field">
                Correo
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="res-step__actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(2)}
              >
                ← Volver
              </button>
              <button type="submit" className="btn btn-primary">
                Confirmar reserva ✓
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="res-step res-step--success">
            <div className="success-icon">⛩</div>
            <p className="success-text">
              Te esperamos en Sazón y Shoyu.
              <br />
              Te mandamos la confirmación a tu correo.
            </p>

            <div className="summary summary--wide">
              <div className="summary__row">
                <span>Fecha</span>
                <strong>{dateLabel}</strong>
              </div>
              <div className="summary__row">
                <span>Hora</span>
                <strong>{time}</strong>
              </div>
              <div className="summary__row">
                <span>Comensales</span>
                <strong>{quantity} persona{quantity > 1 ? "s" : ""}</strong>
              </div>
              <div className="summary__row">
                <span>Platos</span>
                <strong>{dishLabel}</strong>
              </div>
              <div className="summary__row">
                <span>Nombre</span>
                <strong>{name}</strong>
              </div>
              <div className="summary__row">
                <span>Teléfono</span>
                <strong>{phone}</strong>
              </div>
              <div className="summary__row">
                <span>Correo</span>
                <strong>{email}</strong>
              </div>
            </div>

            <button type="button" className="btn btn-primary" onClick={resetAll}>
              Hacer otra reserva
            </button>

            <p className="res-footnote">
              Surco, Lima · reservas@sazonshoyu.pe
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
