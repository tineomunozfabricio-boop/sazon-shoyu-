# Sazón & Shoyu — Sitio web + Panel Admin (React + Vite)

Sitio del restaurante nikkei **Sazón & Shoyu**, con panel de administración completo, hecho con React 19 + Vite + React Router. Todo (login/registro, reservas, mensajes de contacto, menú, mesas y configuración) queda guardado en el navegador y conectado entre el sitio público y el panel admin.

## Páginas del sitio público

- `/` — Inicio (hero, editable desde el admin)
- `/menu` — Carta / Menú (se llena con los platos que edites en el admin)
- `/nosotros` — Historia, chefs, misión/visión/valores
- `/contacto` — Formulario de contacto (los mensajes llegan al admin)
- `/login` — Iniciar sesión
- `/registro` — Crear cuenta
- `/reservar` — Flujo de reserva en 3 pasos → la reserva aparece al instante en el admin

## Panel de administración

- `/admin/login` — Acceso exclusivo para administradores
  - **Usuario demo:** `admin@sazonshoyu.pe`
  - **Contraseña demo:** `admin123`
- `/admin/reservas` — Ver, filtrar, crear, editar estado y cancelar reservas
- `/admin/clientes` — Clientes registrados (visitas calculadas desde sus reservas reales)
- `/admin/menu` — Añadir, editar, marcar agotado/disponible o eliminar platos
- `/admin/mesas` — Mapa de mesas (clic para cambiar Libre/Ocupado) y ocupación por turno
- `/admin/mensajes` — Bandeja con los mensajes del formulario de Contacto
- `/admin/estadisticas` — Métricas calculadas en base a tus datos reales
- `/admin/configuraciones` — Datos del restaurante, horarios, **y aquí subes tu logo y tu imagen de portada**

## Cómo correrlo

npm install
npm run dev

