# ¿Quién quiere ser Ingeniero de Redes?

Juego tipo quiz (estilo "¿Quién quiere ser millonario?") con **React + Vite** y empaquetado a Android con **Capacitor**.  
Incluye autenticación con Google y preguntas en **Firebase Firestore**.

## Estructura del repo
```
quien-quiere-ser-ingeniero-de-redes/
  ├─ src/                   # Código fuente (web)
  ├─ docs/                  # Documentación para integradora
  └─ .github/               # Plantillas de Issues/PR y CI
```

## Cómo correr (Web)
```bash
npm install
npm run dev
```

## Cómo construir Android (Capacitor)
```bash
# 1) Build web
npm run build

# 2) Inicializa Capacitor (solo primera vez)
npx cap init "QuienQuiereSerIngenieroDeRedes" com.brayam.quiz -y

# 3) Añade Android (solo primera vez)
npx cap add android

# 4) Copia artefactos web a Android
npx cap copy

# 5) Abre Android Studio
npx cap open android
```

> Asegura tus credenciales de Firebase en `src/services/firebase.js`.  
> Para autenticación Google en Android, añade **SHA-1** en la app de Firebase y descarga `google-services.json` al módulo `android/app/`.

## Estándares
- Branches: `main`, `dev`, `feat/*`, `fix/*`
- PRs con plantilla y revisión
- Issues con plantillas

## Docs
- `docs/requirements.md`
- `docs/plan-trabajo.md`
- `docs/backlog.md`
- `docs/bitacoras.md`
- `docs/minutas.md`
- `docs/arquitectura.md`

## Licencia
MIT
