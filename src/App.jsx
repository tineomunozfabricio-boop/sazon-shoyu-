import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Reservation from "./pages/Reservation.jsx";
import MisReservas from "./pages/MisReservas.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminReservas from "./admin/AdminReservas.jsx";
import AdminClientes from "./admin/AdminClientes.jsx";
import AdminMenu from "./admin/AdminMenu.jsx";
import AdminMesas from "./admin/AdminMesas.jsx";
import AdminMensajes from "./admin/AdminMensajes.jsx";
import AdminEstadisticas from "./admin/AdminEstadisticas.jsx";
import AdminConfiguraciones from "./admin/AdminConfiguraciones.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/reservar" element={<Reservation />} />
      <Route path="/mis-reservas" element={<MisReservas />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminReservas />} />
      <Route path="/admin/reservas" element={<AdminReservas />} />
      <Route path="/admin/clientes" element={<AdminClientes />} />
      <Route path="/admin/menu" element={<AdminMenu />} />
      <Route path="/admin/mesas" element={<AdminMesas />} />
      <Route path="/admin/mensajes" element={<AdminMensajes />} />
      <Route path="/admin/estadisticas" element={<AdminEstadisticas />} />
      <Route path="/admin/configuraciones" element={<AdminConfiguraciones />} />
    </Routes>
  );
}
