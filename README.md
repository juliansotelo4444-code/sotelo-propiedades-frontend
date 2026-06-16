# Sotelo Propiedades — Frontend

Sitio web de la inmobiliaria **Sotelo Propiedades**, construido con **React + Vite**. Permite ver propiedades en venta y alquiler, registrarse, publicar y administrar propiedades propias.

---

## Instalación

```bash
git clone <repo-url>
cd sotelo-frontend
npm install
cp .env.example .env   # configurar la URL del backend
npm run dev            # http://localhost:5173
```

### Variables de entorno

```
VITE_API_URL=http://localhost:4000/api
```

---

## Estructura

```
src/
├─ context/         → AuthContext (estado de sesión)
├─ services/        → api.js (axios) + apiServices.js
├─ pages/
│   ├─ HomePage              → landing con propiedades destacadas
│   ├─ PropertiesPage        → listado con filtros
│   ├─ PropertyDetailPage    → detalle + galería de fotos
│   ├─ MyPropertiesPage      → mis publicaciones + tipos de propiedad
│   ├─ NewPropertyPage       → formulario para publicar
│   ├─ LoginPage / RegisterPage / VerifyEmailPage
├─ components/
│   ├─ layout/       → Navbar, Footer, Layout
│   ├─ properties/   → PropertyCard, PropertyModal
│   └─ common/       → SoteloLogo (logo SVG)
└─ App.jsx           → rutas
```

---

## Funcionalidades

### Público (sin login)
- Ver listado de propiedades en venta y alquiler
- Filtrar por operación, estado, tipo, moneda, rango de precio y búsqueda libre
- Ver el detalle completo de cada propiedad con galería de fotos

### Usuario registrado
- Registro con verificación de email obligatoria
- Login con JWT
- Publicar nuevas propiedades
- Editar y eliminar sus propias propiedades
- Crear y administrar tipos de propiedad (Casa, Departamento, Local, etc.)

---

## Responsividad

- De 320px a 2000px de ancho
- Navbar con menú hamburguesa en mobile
- Grillas adaptativas con `auto-fill / auto-fit`
- Filtros laterales que se apilan arriba en pantallas chicas

---

## Identidad visual

Paleta roja y blanca acorde a la marca Sotelo Propiedades. Logo en SVG (sin archivos externos) en `src/components/common/SoteloLogo.jsx`.

---

## Despliegue

Recomendado: **Vercel** o **Netlify**. Configurar `VITE_API_URL` con la URL pública del backend desplegado.

---

## Credenciales de prueba

```
Email: demo@sotelopropliedades.com
Password: demo1234
```
