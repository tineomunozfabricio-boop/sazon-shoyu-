import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadDB, saveDB, uid } from "../lib/db.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [db, setDb] = useState(() => loadDB());

  useEffect(() => {
    saveDB(db);
  }, [db]);

  const currentUser = db.session
    ? db.users.find((u) => u.id === db.session) || null
    : null;

  // ---------- AUTH ----------
  const register = useCallback((data) => {
    let result = { ok: false, error: "" };
    setDb((prev) => {
      const exists = prev.users.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );
      if (exists) {
        result = { ok: false, error: "Ya existe una cuenta con ese correo." };
        return prev;
      }
      const newUser = {
        id: uid("user"),
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        password: data.password,
        role: "cliente",
      };
      result = { ok: true, error: "" };
      return {
        ...prev,
        users: [...prev.users, newUser],
        session: newUser.id,
      };
    });
    return result;
  }, []);

  const login = useCallback((email, password) => {
    let result = { ok: false, error: "", role: null };
    setDb((prev) => {
      const found = prev.users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      if (!found) {
        result = { ok: false, error: "Correo o contraseña incorrectos.", role: null };
        return prev;
      }
      result = { ok: true, error: "", role: found.role };
      return { ...prev, session: found.id };
    });
    return result;
  }, []);

  const logout = useCallback(() => {
    setDb((prev) => ({ ...prev, session: null }));
  }, []);

  const deleteUser = useCallback((id) => {
    let result = { ok: false, error: "" };
    setDb((prev) => {
      const target = prev.users.find((u) => u.id === id);
      if (!target) {
        result = { ok: false, error: "Usuario no encontrado." };
        return prev;
      }
      if (target.role === "admin") {
        result = { ok: false, error: "No se puede eliminar a un administrador." };
        return prev;
      }
      result = { ok: true, error: "" };
      return {
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        // si el usuario eliminado tenía sesión abierta, se cierra
        session: prev.session === id ? null : prev.session,
      };
    });
    return result;
  }, []);

  // ---------- RESERVAS ----------
  const addReservation = useCallback((reservation) => {
    setDb((prev) => {
      const nueva = { id: uid("res"), estado: "Pendiente", ...reservation };
      return {
        ...prev,
        reservations: [nueva, ...prev.reservations],
      };
    });
  }, []);

  const updateReservationStatus = useCallback((id, estado) => {
    setDb((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === id ? { ...r, estado } : r
      ),
    }));
  }, []);

  const deleteReservation = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      reservations: prev.reservations.filter((r) => r.id !== id),
    }));
  }, []);

  // ---------- MENU ----------
  const addMenuItem = useCallback((item) => {
    setDb((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { id: uid("plato"), disponible: true, ...item }],
    }));
  }, []);

  const updateMenuItem = useCallback((id, patch) => {
    setDb((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  const deleteMenuItem = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((m) => m.id !== id),
    }));
  }, []);

  // ---------- MESAS ----------
  const cycleTableStatus = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      tables: prev.tables.map((t) =>
        t.id === id
          ? { ...t, estado: t.estado === "Libre" ? "Ocupado" : "Libre" }
          : t
      ),
    }));
  }, []);

  const addTable = useCallback((table) => {
    setDb((prev) => ({
      ...prev,
      tables: [...prev.tables, { id: uid("mesa"), estado: "Libre", ...table }],
    }));
  }, []);

  // ---------- MENSAJES DE CONTACTO ----------
  const addMessage = useCallback((msg) => {
    setDb((prev) => ({
      ...prev,
      messages: [
        { id: uid("msg"), fecha: new Date().toISOString(), leido: false, ...msg },
        ...prev.messages,
      ],
    }));
  }, []);

  const markMessageRead = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, leido: true } : m)),
    }));
  }, []);

  const toggleMessageRead = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, leido: !m.leido } : m)),
    }));
  }, []);

  const deleteMessage = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id),
    }));
  }, []);

  // ---------- CONFIGURACION ----------
  const updateSettings = useCallback((patch) => {
    setDb((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const updateHorario = useCallback((dia, patch) => {
    setDb((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        horarios: {
          ...prev.settings.horarios,
          [dia]: { ...prev.settings.horarios[dia], ...patch },
        },
      },
    }));
  }, []);

  const value = {
    db,
    currentUser,
    isAdmin: currentUser?.role === "admin",
    register,
    login,
    logout,
    deleteUser,
    addReservation,
    updateReservationStatus,
    deleteReservation,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    cycleTableStatus,
    addTable,
    addMessage,
    markMessageRead,
    toggleMessageRead,
    deleteMessage,
    updateSettings,
    updateHorario,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
