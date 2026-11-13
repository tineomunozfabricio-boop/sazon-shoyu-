export const TIPOS_RESERVA = [
  {
    id: "normal",
    nombre: "Mesa normal",
    desc: "Mesa para una sola persona",
    min: 1,
    max: 1,
    garantia: 20,
  },
  {
    id: "estandar",
    nombre: "Estándar",
    desc: "Mesa común para parejas o grupos pequeños",
    min: 2,
    max: 5,
    garantia: 20,
  },
  {
    id: "familiar",
    nombre: "Familiar",
    desc: "Mesa grande, con sillas para niños",
    min: 3,
    max: 10,
    garantia: 15,
  },
  {
    id: "ocasiones",
    nombre: "Ocasiones especiales",
    desc: "Cumpleaños y aniversarios, con decoración",
    min: 2,
    max: 12,
    garantia: 40,
  },
  {
    id: "corporativa",
    nombre: "Corporativa",
    desc: "Almuerzos o cenas de empresa",
    min: 2,
    max: 20,
    garantia: 30,
  },
  {
    id: "vip",
    nombre: "VIP",
    desc: "Zona privada con atención personalizada",
    min: 2,
    max: 8,
    garantia: 80,
  },
];

export const METODOS_PAGO = [
  { id: "yape", nombre: "Yape", desc: "Pago con QR", qr: true, verbo: "Yapea" },
  { id: "plin", nombre: "Plin", desc: "Pago con QR", qr: true, verbo: "Plinea" },
  { id: "tarjeta", nombre: "Tarjeta", desc: "Visa o Mastercard" },
  { id: "efectivo", nombre: "Efectivo", desc: "Pagas en el local" },
];
