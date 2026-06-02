# MeshIoT Manager

Enterprise MERN + Electron desktop app for mesh IoT device management, TCP/MAC device connection, and MongoDB persistence.

## What this project includes

- **MongoDB** persistence with `mongoose`
- **Express** REST backend for devices and configuration
- **React + Vite** renderer app inside Electron
- **Electron** desktop shell for local TCP/MAC connectivity
- **JavaScript** used across server, Electron, and shared modules
- **Windows packaging** support through `electron-builder`

## Project structure

- `client/` — React/Vite frontend for Electron renderer
- `server/` — Express backend + MongoDB API
- `electron/` — Electron main/preload shell
- `shared/` — common types and utilities
- `.env.example` — environment variables template

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.example .env
```

3. Start the backend and renderer in development:

```bash
npm run dev:server
npm run dev:client
```

4. Launch Electron after the backend and client are ready:

```bash
npx electron .
```

5. Build production assets:

```bash
npm run build
```

6. Package a Windows installer:

```bash
npm run package
```

## Notes

- Use Electron for desktop runtime, not the Chrome browser directly.
- The backend server uses `PORT` from `.env` and connects to `MONGO_URI`.
- Device details are stored in MongoDB and accessible from the Electron UI.
