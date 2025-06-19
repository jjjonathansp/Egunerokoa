# Egunerokoa

Egunerokoa es una aplicación web desarrollada en React para la gestión de diarios personales. Permite a los usuarios crear, editar y consultar entradas diarias de manera sencilla y segura.

## Características

- Registro y autenticación de usuarios
- Creación, edición y eliminación de entradas del diario
- Visualización de entradas por fecha
- Interfaz intuitiva y responsiva
- Almacenamiento seguro de datos

## Tecnologías utilizadas

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/) (para navegación)
- [Tailwind CSS](https://tailwindcss.com/) (para estilos)
- [Supabase](https://supabase.io/) (backend y autenticación)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/egunerokoa.git
   cd egunerokoa
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno si es necesario (por ejemplo, para Firebase):

   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus credenciales
   ```

4. Inicia la aplicación en modo desarrollo:

   ```bash
   npm start
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Migraciones de Supabase

Para gestionar y ejecutar las migraciones de la base de datos con Supabase, asegúrate de tener instalado [Supabase CLI](https://supabase.com/docs/guides/cli).

1. Instala Supabase CLI con [Scoop](https://scoop.sh/) si no lo tienes:

   ```bash
   irm get.scoop.sh | iex
   scoop install supabase
   ```

2. Inicia sesión en Supabase CLI:

   ```bash
   supabase login
   ```

3. Vincula tu proyecto local con tu proyecto de Supabase (solo la primera vez):

   ```bash
   supabase link --project-ref <tu_project_ref>
   ```

4. Para ejecutar las migraciones pendientes en tu proyecto local:

   ```bash
   supabase db push
   ```

5. Para crear una nueva migración:

   ```bash
   supabase migration new nombre_de_la_migracion
   ```

Consulta la [documentación oficial de Supabase CLI](https://supabase.com/docs/guides/cli) para más detalles.

## Uso

- Regístrate o inicia sesión.
- Crea nuevas entradas en tu diario personal.
- Edita o elimina entradas existentes.
- Navega entre las entradas por fecha.

## Estructura del proyecto

```
egunerokoa/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerir mejoras o reportar errores.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## Autor

Desarrollado por [Tu Nombre](https://github.com/tuusuario).
