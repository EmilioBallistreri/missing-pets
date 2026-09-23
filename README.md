# 🐾 Patitas a Casa

Plataforma comunitaria y colaborativa de rescate, reporte de mascotas extraviadas y adopción responsable. Diseñada para actuar con velocidad ante emergencias, facilitar la difusión barrial y reunir familias mediante geolocalización y herramientas visuales.

---

## 🌟 Características Principales

1. **🚨 Alertas de Búsqueda y Modo Express:**
   - Publicación rápida en 30 segundos con detección de ubicación GPS automática.
   - Geocodificación inversa con OpenStreetMap (Nominatim) para autocompletar barrio y calle.
   - Soporte para mascotas perdidas, encontradas y en adopción responsable.

2. **🗺️ Mapa Interactivo y Filtros por Proximidad (GPS):**
   - Visualización geográfica basada en Leaflet con marcadores temáticos según especie y estado.
   - Filtro de radio de proximidad (2 km, 5 km, 10 km o sin límite) calculado con la **fórmula de Haversine**.
   - Búsqueda en tiempo real insensible a acentos y mayúsculas.

3. **📄 Generador de Carteles Multiformato con Descarga Directa:**
   - **Afiche A4 imprimible:** Con código QR dinámico listo para pegar en la vía pública o veterinarias.
   - **Historia 9:16:** Adaptado para Instagram Stories y estados de WhatsApp.
   - **Post Cuadrado 1:1:** Para grupos de Facebook y Twitter.
   - **Descarga en imagen PNG** de alta definición con un solo clic gracias a `html-to-image`.

4. **✨ Comparador Inteligente de Coincidencias:**
   - Algoritmo que cruza reportes de mascotas perdidas y encontradas evaluando especie, sexo, tamaño y distancia geográfica.
   - Vista en pantalla dividida (*Split Screen*) para comparar fotos y rasgos particulares antes de contactar.

5. **📡 Historial de Avistamientos Comunitarios:**
   - Registro de pistas por vecinos con niveles de certeza (*Alta*, *Media*, *Lejana*), fotos y hora aproximada.

6. **🎨 Experiencia de Usuario Premium y Móvil:**
   - Soporte nativo para modo oscuro y claro con persistencia de preferencia.
   - Barra de navegación inferior optimizada para pantallas táctiles y teléfonos móviles.
   - Soporte de teclado (cierre accesible con tecla `Escape` en todos los modales).
   - Enlace directo a WhatsApp con mensaje preconfigurado según el tipo de reporte.

---

## 🛠️ Pila Tecnológica

- **Frontend:** React 19, Vite 8, JavaScript (ES Modules).
- **Estilos:** Vanilla CSS con variables de diseño, glassmorphism, temas claro/oscuro y diseño responsivo.
- **Mapas:** [Leaflet](https://leafletjs.com/) con tiles de OpenStreetMap.
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Exportación visual:** [html-to-image](https://github.com/bubkoo/html-to-image).
- **Linter y Compilación:** Oxlint y Vite con plugin React.
- **Base de Datos (Producción):** PostgreSQL 15+ con extensión espacial **PostGIS** y UUIDs (consultar `database/schema.sql`).

---

## 📁 Estructura del Proyecto

```text
pets-missing-proyect/
├── database/
│   └── schema.sql            # Esquema SQL completo con PostGIS, funciones y RLS
├── public/                   # Recursos estáticos
├── src/
│   ├── assets/               # Imágenes y recursos estáticos
│   ├── components/           # Componentes modulares de interfaz
│   │   ├── CelebrationModal.jsx     # Celebración de reencuentro o adopción
│   │   ├── FlyerGeneratorModal.jsx  # Carteles A4, 9:16 y 1:1 con descarga PNG
│   │   ├── HeroBanner.jsx           # Banner principal y métricas comunitarias
│   │   ├── HowToHelpModal.jsx       # Guía y protocolos de rescate
│   │   ├── InteractiveMap.jsx       # Mapa Leaflet interactivo
│   │   ├── MatchCompareModal.jsx    # Comparador split-screen perdido vs encontrado
│   │   ├── MobileBottomNav.jsx      # Barra de navegación móvil
│   │   ├── Navbar.jsx               # Navegación superior y selector de tema
│   │   ├── PetCard.jsx              # Tarjeta de mascota en el grid
│   │   ├── PetDetailModal.jsx       # Ficha completa, galería y avistamientos
│   │   ├── PetFilters.jsx           # Barra de búsqueda y filtros GPS
│   │   ├── PublishModal.jsx         # Formulario de publicación con GPS inverso
│   │   ├── SightingModal.jsx        # Reporte de avistamiento con certeza
│   │   └── ToastNotification.jsx    # Notificaciones flotantes
│   ├── hooks/                # Custom Hooks para modularización de lógica
│   │   ├── usePets.js               # Estado y persistencia de mascotas
│   │   └── usePetFilters.js         # Filtros, ordenamiento y radio de proximidad
│   ├── services/
│   │   ├── mockData.js              # Semilla inicial de datos geolocalizados
│   │   └── petStorage.js            # Persistencia local y algoritmo de matching
│   ├── utils/
│   │   └── helpers.js               # Haversine, compresión canvas, Nominatim, WhatsApp
│   ├── App.jsx               # Componente principal con lazy loading
│   ├── index.css             # Sistema de diseño y tokens CSS
│   └── main.jsx              # Punto de entrada de React 19
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Inicio Rápido en Desarrollo

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/EmilioBallistreri/missing-pets.git
cd missing-pets
npm install
```

### 2. Ejecutar Servidor Local de Desarrollo

```bash
npm run dev
```

Abre en tu navegador la URL que indica la terminal (usualmente `http://localhost:5173`).

### 3. Verificar Calidad y Compilar

```bash
# Ejecutar linter Oxlint
npm run lint

# Generar bundle de producción optimizado
npm run build
```

---

## 🗄️ Configuración de Base de Datos (PostgreSQL / Supabase)

El archivo `database/schema.sql` contiene la estructura relacional completa lista para desplegar en Supabase o PostgreSQL con PostGIS:

- Extensión `postgis` y columna geográfica `GEOGRAPHY(Point, 4326)` para consultas espaciales con `ST_DWithin`.
- Búsqueda全文 optimizada en español (`tsvector` con índice GIN).
- Tablas para usuarios, mascotas, avistamientos, postulaciones de adopción y moderación comunitaria.
- Políticas de Seguridad a Nivel de Fila (RLS).
