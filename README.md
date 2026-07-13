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

```bash
npm install
npm run dev
```

Abre http://localhost:5173 (sitio público) y http://localhost:5173/admin/login (panel admin).

## Build de producción

```bash
npm run build
npm run preview
```

## Cómo poner tu logo y tus fotos

1. Entra al panel admin → **Configuraciones**.
2. En "Logo e imágenes del sitio" sube tu logo y tu imagen de portada.
3. Se aplican al instante en navbar, footer, login, registro, inicio y menú.

Si prefieres dejarlas fijas en el código (en vez de subirlas cada vez desde el navegador), reemplaza los archivos en `src/assets/` y ajusta los `import` en `Navbar.jsx`, `Footer.jsx`, `Home.jsx`, etc. Las fotos de la página "Nosotros" y las miniaturas de la galería del menú siguen usando imágenes de Unsplash de muestra — cámbialas en `src/pages/Nosotros.jsx` y `src/data/menu.js`.

## Cómo funciona la persistencia (léelo antes de publicar el sitio)

Todo se guarda con `localStorage` del navegador (ver `src/lib/db.js` y `src/context/AppContext.jsx`) — no hay un servidor ni una base de datos real detrás. Esto significa:

- ✅ Si alguien se registra, reserva o te escribe, y luego entras al panel admin **en ese mismo navegador**, verás la información al instante. Ideal para probar todo el flujo de punta a punta o para un solo dispositivo (por ejemplo, una tablet en la caja del restaurante).
- ⚠️ **No se sincroniza entre dispositivos.** Si un cliente reserva desde su celular y tú abres el panel admin desde tu laptop, no verás esa reserva ahí — cada navegador tiene su propia copia guardada localmente.
- ⚠️ Las contraseñas se guardan en texto plano en el navegador. Está bien para pruebas, pero no uses este login tal cual con datos reales de clientes.

Si quieres que el restaurante funcione de verdad con reservas de clientes reales llegando a tu panel desde cualquier dispositivo, el siguiente paso es agregar un backend con base de datos real (por ejemplo Node/Express + una base de datos, o un servicio como Supabase/Firebase). Puedo ayudarte a construir eso cuando quieras dar ese paso.
