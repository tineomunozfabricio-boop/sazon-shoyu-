import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { timeSlots } from "../data/menu.js";
import { useApp } from "../context/AppContext.jsx";
import { TIPOS_RESERVA, METODOS_PAGO } from "./data.js";
import "./Reservation.css";
import Reserva from "../Imagenes/Reserva.jpeg";
import qrYape from "../Imagenes/qr-yape.jpeg";
import qrPlin from "../Imagenes/qr-plin.jpeg";




const STEPS = [
  { key: 1, label: "Cuándo" },
  { key: 2, label: "Fecha" },
  { key: 3, label: "Tipo" },
  { key: 4, label: "Datos" },
  { key: 5, label: "Pago" },
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

const pad2 = (n) => String(n).padStart(2, "0");

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function rangoPersonas(t) {
  if (t.min === t.max) return `${t.min} persona${t.min > 1 ? "s" : ""}`;
  return `${t.min} a ${t.max} personas`;
}

export default function Reservation() {
  const { db, addReservation, currentUser } = useApp();

  const today = useMemo(() => new Date(), []);
  const [step, setStep] = useState(1);
  const [time, setTime] = useState(null);
  const [quantity, setQuantity] = useState(2);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const [tipoId, setTipoId] = useState(null);

  const [name, setName] = useState(
    currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : ""
  );
  const [phone, setPhone] = useState(
    currentUser?.telefono?.replace("+51", "").trim() ?? ""
  );
  const [email, setEmail] = useState(currentUser?.email ?? "");

  const [metodoId, setMetodoId] = useState(null);
  const [card, setCard] = useState({ numero: "", titular: "", exp: "", cvv: "" });

  const [reserva, setReserva] = useState(null); // resumen final

  const cells = useMemo(
    () => buildCalendar(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const esMesActual =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // El tipo elegido solo vale si cabe la cantidad de personas actual
  const tipo = useMemo(() => {
    const t = TIPOS_RESERVA.find((x) => x.id === tipoId);
    return t && quantity >= t.min && quantity <= t.max ? t : null;
  }, [tipoId, quantity]);

  const metodo = METODOS_PAGO.find((m) => m.id === metodoId) ?? null;
  const garantia = tipo ? tipo.garantia * quantity : 0;

  const dateISO = selectedDay
    ? `${viewYear}-${pad2(viewMonth + 1)}-${pad2(selectedDay)}`
    : "";
  const dateLabel = selectedDay
    ? `${pad2(selectedDay)}/${pad2(viewMonth + 1)}/${viewYear}`
    : "—";

  const pagoValido = (() => {
    if (!metodo) return false;
    if (metodo.id === "tarjeta") {
      const digits = card.numero.replace(/\D/g, "");
      return (
        digits.length >= 13 &&
        digits.length <= 19 &&
        card.titular.trim().length > 0 &&
        /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp) &&
        /^\d{3,4}$/.test(card.cvv)
      );
    }
    return true; // efectivo
  })();

  function goPrevMonth() {
    if (esMesActual) return;
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

  function isPastDay(day) {
    if (!esMesActual) return false;
    return day < today.getDate();
  }

  function handleCardChange(field, value) {
    let v = value;
    if (field === "numero") {
      v = value
        .replace(/\D/g, "")
        .slice(0, 19)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }
    if (field === "exp") {
      const d = value.replace(/\D/g, "").slice(0, 4);
      v = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    }
    if (field === "cvv") v = value.replace(/\D/g, "").slice(0, 4);
    setCard((prev) => ({ ...prev, [field]: v }));
  }

  function handleConfirm() {
    if (!tipo || !metodo || !pagoValido) return;

    const codigo = `SS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const telefono = `+51 ${phone}`;

    let pagoDetalle = "Se paga en el local";
    if (metodo.qr) pagoDetalle = `Pago con QR de ${metodo.nombre}`;
    if (metodo.id === "tarjeta") {
      pagoDetalle = `Tarjeta •••• ${card.numero.replace(/\D/g, "").slice(-4)}`;
    }

    // La reserva queda guardada igual que antes (el admin la ve en "Reservas").
    // Los datos de la tarjeta NO se guardan.
    addReservation({
      nombre: name,
      email,
      telefono,
      fecha: dateISO,
      hora: time,
      personas: quantity,
      experiencia: tipo.nombre,
      estado: "Pendiente",
      tipo: tipo.nombre,
      garantia,
      metodoPago: metodo.nombre,
      codigo,
    });

    setReserva({
      codigo,
      fecha: dateLabel,
      hora: time,
      personas: quantity,
      tipo: tipo.nombre,
      precioPersona: tipo.garantia,
      nombre: name,
      telefono,
      email,
      metodo: metodo.nombre,
      pagoDetalle,
      garantia,
    });
    setStep(6);
  }

  function resetAll() {
    setStep(1);
    setTime(null);
    setQuantity(2);
    setSelectedDay(null);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setTipoId(null);
    setMetodoId(null);
    setCard({ numero: "", titular: "", exp: "", cvv: "" });
    setReserva(null);
  }

  return (
    <div className="page">
      <Navbar />

      <section className="rv-hero">
        <img src={Reserva} alt="Reserva" className="rv-hero__img" />
        <div className="rv-hero__overlay">
          <p className="rv-hero__eyebrow">Lima · Cocina de fusión</p>
          <h1 className="rv-hero__title">
            Sazón <span className="accent-italic">&amp; Shoyu</span>
          </h1>
          <p className="rv-hero__sub">Perú x Asia · Dos almas, una mesa</p>
        </div>
      </section>

      <div className="rv-body">
        <ol className="rv-stepper">
          {STEPS.map((s) => (
            <li
              key={s.key}
              className={
                "rv-stepper__item" +
                (step >= s.key ? " is-reached" : "") +
                (step === s.key ? " is-active" : "") +
                (step > s.key ? " is-done" : "")
              }
            >
              <span className="rv-stepper__dot">
                {step > s.key ? "✓" : s.key}
              </span>
              <span className="rv-stepper__label">{s.label}</span>
            </li>
          ))}
        </ol>

        {/* ───────── 1. CUÁNDO ───────── */}
        {step === 1 && (
          <div className="rv-narrow">
            <p className="rv-eyebrow">Turno</p>
            <div className="rv-time-grid">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={"rv-time" + (time === t ? " is-active" : "")}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="rv-eyebrow rv-spaced">Cantidad</p>
            <div className="rv-qty">
              <button
                type="button"
                className="rv-qty__btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="rv-qty__value">{quantity}</span>
              <button
                type="button"
                className="rv-qty__btn"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              >
                +
              </button>
              <span className="rv-qty__label">Personas</span>
            </div>

            <div className="rv-actions rv-actions--end">
              <button
                type="button"
                className="rv-btn"
                disabled={!time}
                onClick={() => setStep(2)}
              >
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ───────── 2. FECHA ───────── */}
        {step === 2 && (
          <div className="rv-narrow">
            <div className="rv-calendar">
              <h2 className="rv-calendar__title">
                Elige tu <span className="accent-italic">fecha</span>
              </h2>
              <div className="rv-calendar__nav">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  disabled={esMesActual}
                  aria-label="Mes anterior"
                >
                  ‹
                </button>
                <span>
                  {MONTHS[viewMonth]}{" "}
                  <span className="accent-italic">{viewYear}</span>
                </span>
                <button
                  type="button"
                  onClick={goNextMonth}
                  aria-label="Mes siguiente"
                >
                  ›
                </button>
              </div>

              <div className="rv-calendar__weekdays">
                {WEEKDAYS.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </div>

              <div className="rv-calendar__grid">
                {cells.map((day, i) =>
                  day ? (
                    <button
                      key={i}
                      type="button"
                      disabled={isPastDay(day)}
                      className={
                        "rv-calendar__day" +
                        (selectedDay === day ? " is-active" : "")
                      }
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ) : (
                    <span key={i} className="rv-calendar__day is-empty" />
                  )
                )}
              </div>
            </div>

            <div className="rv-actions">
              <button
                type="button"
                className="rv-btn"
                onClick={() => setStep(1)}
              >
                <span aria-hidden="true">←</span> Volver
              </button>
              <button
                type="button"
                className="rv-btn"
                disabled={!selectedDay}
                onClick={() => setStep(3)}
              >
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ───────── 3. TIPO DE RESERVA ───────── */}
        {step === 3 && (
          <div>
            <h2 className="rv-title">Tipo de reserva</h2>
            <p className="rv-sub">Elige la mesa que mejor se ajusta a tu grupo</p>

            <div className="rv-tipos">
              {TIPOS_RESERVA.map((t) => {
                const cabe = quantity >= t.min && quantity <= t.max;
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!cabe}
                    className={
                      "rv-tipo" + (tipo?.id === t.id ? " is-active" : "")
                    }
                    onClick={() => setTipoId(t.id)}
                  >
                    <span className="rv-tipo__name">{t.nombre}</span>
                    <span className="rv-tipo__desc">{t.desc}</span>
                    <span className="rv-tipo__people">{rangoPersonas(t)}</span>
                    <span className="rv-tipo__price">
                      Garantía S/ {t.garantia} por persona
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="rv-hint">
              Reservas para {quantity} persona{quantity > 1 ? "s" : ""}: los tipos
              que no admiten ese grupo aparecen deshabilitados. Puedes cambiar la
              cantidad volviendo al primer paso.
            </p>

            <div className="rv-actions">
              <button
                type="button"
                className="rv-btn"
                onClick={() => setStep(2)}
              >
                <span aria-hidden="true">←</span> Volver
              </button>
              <button
                type="button"
                className="rv-btn"
                disabled={!tipo}
                onClick={() => setStep(4)}
              >
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ───────── 4. DATOS ───────── */}
        {step === 4 && (
          <form
            className="rv-narrow"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(5);
            }}
          >
            <div className="rv-summary">
              <div className="rv-summary__row">
                <span>Fecha</span>
                <strong>{dateLabel}</strong>
              </div>
              <div className="rv-summary__row">
                <span>Hora</span>
                <strong>{time}</strong>
              </div>
              <div className="rv-summary__row">
                <span>Comensales</span>
                <strong>
                  {quantity} persona{quantity > 1 ? "s" : ""}
                </strong>
              </div>
              <div className="rv-summary__row">
                <span>Tipo de reserva</span>
                <strong>{tipo?.nombre}</strong>
              </div>
            </div>

            <div className="rv-form">
              <label className="rv-field">
                Nombre completo
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <div className="rv-form__grid">
                <label className="rv-field">
                  Teléfono
                  <div className="rv-phone">
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
                <label className="rv-field">
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
            </div>

            <div className="rv-actions">
              <button
                type="button"
                className="rv-btn"
                onClick={() => setStep(3)}
              >
                <span aria-hidden="true">←</span> Volver
              </button>
              <button type="submit" className="rv-btn">
                Continuar <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        )}

        {/* ───────── 5. PAGO ───────── */}
        {step === 5 && (
          <div>
            <h2 className="rv-title">Método de pago</h2>
            <p className="rv-sub">¿Cómo quieres pagar tu garantía?</p>

            <div className="rv-metodos">
              {METODOS_PAGO.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={"rv-metodo" + (metodoId === m.id ? " is-active" : "")}
                  onClick={() => setMetodoId(m.id)}
                >
                  <span className="rv-metodo__name">{m.nombre}</span>
                  <span className="rv-metodo__desc">{m.desc}</span>
                </button>
              ))}
            </div>

            {metodo && (
              <div className="rv-pay">
                {metodo.qr && (
  <div className="rv-pay__top">
    <img
      src={{ yape: qrYape, plin: qrPlin }[metodo.id]}
      alt={`QR de ${metodo.nombre}`}
      className="rv-pay__qr rv-pay__qr--img"
    />
    <div className="rv-pay__instructions">
  <h3>Paga con {metodo.nombre}</h3>
  <ol>
    <li>Abre {metodo.nombre} en tu celular.</li>
    <li>Escanea el código QR.</li>
    <li>Verifica el destinatario y el monto de S/ {garantia} antes de pagar.</li>
  </ol>
</div>
  </div>
)}

                {metodo.id === "tarjeta" && (
                  <div className="rv-pay__card">
                    <label className="rv-field rv-field--full">
                      Número de tarjeta
                      <input
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={card.numero}
                        onChange={(e) => handleCardChange("numero", e.target.value)}
                      />
                    </label>
                    <label className="rv-field rv-field--full">
                      Titular
                      <input
                        placeholder="Como aparece en la tarjeta"
                        value={card.titular}
                        onChange={(e) => handleCardChange("titular", e.target.value)}
                      />
                    </label>
                    <label className="rv-field">
                      Vencimiento
                      <input
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={card.exp}
                        onChange={(e) => handleCardChange("exp", e.target.value)}
                      />
                    </label>
                    <label className="rv-field">
                      CVV
                      <input
                        inputMode="numeric"
                        placeholder="123"
                        value={card.cvv}
                        onChange={(e) => handleCardChange("cvv", e.target.value)}
                      />
                    </label>
                  </div>
                )}

                {metodo.id === "efectivo" && (
                  <p className="rv-pay__cash">
                    Pagarás la garantía directamente en el local el día de tu
                    reserva.
                  </p>
                )}

                <div className="rv-pay__total">
                  <div>
                    <p className="rv-pay__resume">
                      Tipo de reserva · {tipo?.nombre} · {quantity} persona
                      {quantity > 1 ? "s" : ""}
                    </p>
                    <p className="rv-pay__label rv-pay__label--lg">
                      Garantía a pagar
                    </p>
                  </div>
                  <p className="rv-pay__amount">S/ {garantia}</p>
                </div>
              </div>
            )}

            <div className="rv-actions">
              <button
                type="button"
                className="rv-btn"
                onClick={() => setStep(4)}
              >
                <span aria-hidden="true">←</span> Volver
              </button>
              <button
                type="button"
                className="rv-btn"
                disabled={!pagoValido}
                onClick={handleConfirm}
              >
                Confirmar reserva <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ───────── RESUMEN DE COMPRA ───────── */}
        {step === 6 && reserva && (
          <div className="rv-narrow rv-done">
            <div className="rv-done__icon">⛩</div>
            <h2 className="rv-done__title">
              ¡Reserva <span className="accent-italic">registrada</span>!
            </h2>
            <p className="rv-done__text">
              Te esperamos en Sazón y Shoyu. Te mandamos la confirmación a tu
              correo. Tu reserva queda <strong>pendiente</strong> hasta que el
              restaurante la confirme.
            </p>

            <div className="rv-ticket">
              <p className="rv-ticket__head">Resumen de compra</p>

              <div className="rv-ticket__block">
                <div className="rv-summary__row">
                  <span>Código de reserva</span>
                  <strong>{reserva.codigo}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Fecha</span>
                  <strong>{reserva.fecha}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Hora</span>
                  <strong>{reserva.hora}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Comensales</span>
                  <strong>
                    {reserva.personas} persona{reserva.personas > 1 ? "s" : ""}
                  </strong>
                </div>
                <div className="rv-summary__row">
                  <span>Tipo de reserva</span>
                  <strong>{reserva.tipo}</strong>
                </div>
              </div>

              <div className="rv-ticket__block">
                <div className="rv-summary__row">
                  <span>Nombre</span>
                  <strong>{reserva.nombre}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Teléfono</span>
                  <strong>{reserva.telefono}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Correo</span>
                  <strong>{reserva.email}</strong>
                </div>
              </div>

              <div className="rv-ticket__block">
                <div className="rv-summary__row">
                  <span>Método de pago</span>
                  <strong>{reserva.metodo}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>Detalle</span>
                  <strong>{reserva.pagoDetalle}</strong>
                </div>
                <div className="rv-summary__row">
                  <span>
                    Garantía (S/ {reserva.precioPersona} × {reserva.personas})
                  </span>
                  <strong>S/ {reserva.garantia}</strong>
                </div>
              </div>

              <div className="rv-ticket__total">
                <span>Total garantía</span>
                <strong>S/ {reserva.garantia}</strong>
              </div>
            </div>

            <div className="rv-actions rv-actions--center">
              <Link to="/mis-reservas" className="rv-btn rv-btn--outline">
                Ver mis reservas
              </Link>
              <button type="button" className="rv-btn" onClick={resetAll}>
                Hacer otra reserva
              </button>
            </div>

            <p className="rv-footnote">
              {db.settings.direccion} · {db.settings.email}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
