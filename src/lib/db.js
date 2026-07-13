const DB_KEY = "sazon-shoyu-db-v1";

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function seedData() {
  return {
    users: [
      {
        id: "admin-1",
        nombre: "Sandro",
        apellido: "Landeo",
        email: "admin@sazonshoyu.pe",
        telefono: "+51 987654321",
        password: "admin123",
        role: "admin",
      },
      {
        id: uid("user"),
        nombre: "Maria",
        apellido: "Garcia",
        email: "mgarcia@gmail.com",
        telefono: "+51 999111222",
        password: "cliente123",
        role: "cliente",
      },
    ],
    reservations: [
      { id: uid("res"), nombre: "Maria Garcia", email: "mgarcia@gmail.com", telefono: "+51 999111222", fecha: "2026-07-12", hora: "19:00", personas: 4, experiencia: "Omakase Nikkei", estado: "Confirmada" },
      { id: uid("res"), nombre: "Kenji Tanaka", email: "ktanaka@gmail.com", telefono: "+51 999222333", fecha: "2026-07-12", hora: "19:30", personas: 2, experiencia: "Sake", estado: "Confirmada" },
      { id: uid("res"), nombre: "Ana Quispe", email: "aquispe@gmail.com", telefono: "+51 999333444", fecha: "2026-07-12", hora: "20:00", personas: 6, experiencia: "Tradicional Naya", estado: "Pendiente" },
      { id: uid("res"), nombre: "Roberto Lim", email: "rlim@gmail.com", telefono: "+51 999444555", fecha: "2026-07-12", hora: "20:30", personas: 3, experiencia: "Carta", estado: "Confirmada" },
      { id: uid("res"), nombre: "Sofia Watanabe", email: "swatanabe@gmail.com", telefono: "+51 999555666", fecha: "2026-07-12", hora: "21:00", personas: 2, experiencia: "Omakase", estado: "Cancelada" },
      { id: uid("res"), nombre: "Luis Flores", email: "lflores@gmail.com", telefono: "+51 999666777", fecha: "2026-07-12", hora: "13:00", personas: 5, experiencia: "Carta", estado: "Confirmada" },
      { id: uid("res"), nombre: "Yuki Sato", email: "ysato@gmail.com", telefono: "+51 999777888", fecha: "2026-07-12", hora: "13:30", personas: 2, experiencia: "Omakase", estado: "Pendiente" },
    ],
    menuItems: [
      { id: uid("plato"), nombre: "Ceviche Clasico Nikkei", categoria: "Entrada", precio: 48, disponible: true, desc: "Lenguado en leche de tigre, ají limo, cebolla morada y cilantro fresco." },
      { id: uid("plato"), nombre: "Tiradito de Rocoto", categoria: "Entrada", precio: 42, disponible: true, desc: "Láminas de pescado en crema de rocoto amarillo y culantro fresco." },
      { id: uid("plato"), nombre: "Aji de Gallina Shoyu", categoria: "Entrada", precio: 38, disponible: true, desc: "Pollo desmenuzado en crema de ají amarillo, maní, nueces y arroz." },
      { id: uid("plato"), nombre: "Lomo Saltado Shoyu", categoria: "Principales", precio: 65, disponible: true, desc: "Lomo fino, tomate, cebolla, sillao y papas fritas doradas." },
      { id: uid("plato"), nombre: "Nigiri de Aji Amarillo", categoria: "Principales", precio: 72, disponible: false, desc: "Selección del chef con toque de ají amarillo." },
      { id: uid("plato"), nombre: "Anticucho de Pulpo", categoria: "Principales", precio: 58, disponible: true, desc: "Pulpo a la parrilla con anticuchera y papas doradas." },
      { id: uid("plato"), nombre: "Suspiro Limeño", categoria: "Postres", precio: 28, disponible: true, desc: "Merengue de oporto con relleno de crema de leche y toque de vainilla." },
    ],
    tables: Array.from({ length: 12 }, (_, i) => ({
      id: uid("mesa"),
      nombre: `Mesa ${i + 1}`,
      capacidad: [2, 4, 6][i % 3],
      estado: [1, 4, 9].includes(i) ? "Ocupado" : [0, 3].includes(i) ? "Ocupado" : "Libre",
    })),
    messages: [],
    settings: {
      nombreRestaurante: "Sandro Landeo",
      telefono: "+51 987654321",
      email: "reserva@sazonshoyu.pe",
      direccion: "Av. La Mar 456, Miraflores",
      horarios: {
        Lunes: { abierto: true, rango: "12:30--22:00" },
        Martes: { abierto: true, rango: "12:30--22:00" },
        Miercoles: { abierto: true, rango: "12:30--22:00" },
        Jueves: { abierto: true, rango: "12:30--22:00" },
        Viernes: { abierto: true, rango: "12:30--22:00" },
        Sabado: { abierto: true, rango: "12:30--22:00" },
        Domingo: { abierto: true, rango: "12:30--22:00" },
      },
      logoUrl: "",
      heroImageUrl: "",
    },
    session: null, // id del usuario logueado
  };
}

export function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = seedData();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    // completa campos nuevos si el usuario ya tenía datos guardados de una versión previa
    const seeded = seedData();
    return { ...seeded, ...parsed, settings: { ...seeded.settings, ...parsed.settings } };
  } catch {
    return seedData();
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export { uid };
