# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
     # HireReady

    HireReady is a React + TypeScript web app (Vite) for interview preparation and resume analysis. It provides AI-powered interview practice, resume parsing & feedback, interview recording, and job search utilities.

    ## Table of contents
    - [Features](#features)
    - [Tech stack](#tech-stack)
    - [Getting started](#getting-started)
    - [Environment / Secrets](#environment--secrets)
    - [Project structure](#project-structure)
    - [Development tips](#development-tips)
    - [Contributing](#contributing)

    ## Features
    - AI-assisted interview practice and answer evaluation
    - Save and review recorded interview sessions
    - Resume upload and analysis with detailed reports
    - Interview templates and question banks
    - Authentication (Firebase) and file storage for recordings

    ## Tech stack
    - Frontend: React, TypeScript, Vite
    - Styling: Tailwind CSS
    - State: Redux (toolkit)
    - Backend / APIs: Internal API clients in `src/api/` and `src/services/`
    - Auth & storage: Firebase (see `src/firebase/`)

    ## Getting started
    Prerequisites: Node 18+ and a package manager (npm, pnpm, or yarn).

    1. Install dependencies

    ```bash
    npm install
    ```

    2. Run the dev server

    ```bash
    npm run dev
    # Open http://localhost:5173 (default Vite port)
    ```

    3. Build for production

    ```bash
    npm run build
    ```

    4. Preview the production build locally

    ```bash
    npm run preview
    ```

    ## Environment / Secrets
    This project uses Firebase. Copy `.env.example` (if present) or create a `.env` and provide the following values (example keys — adapt to your Firebase project):

    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=messaging_sender_id
    VITE_FIREBASE_APP_ID=app_id
    ```

    Firebase config is read from `src/firebase/config.ts` — update that file or the environment variables above.

    ## Project structure (high level)
    - `src/` — application source
      - `src/pages/` — page components and routes
      - `src/components/` — reusable UI and feature components
      - `src/api/` & `src/services/` — API clients and service wrappers
      - `src/firebase/` — Firebase init, auth and storage helpers
      - `src/redux/` — Redux store and slices
      - `src/utils/` — helpers like `pdfExtractor.ts` and `aiService.ts`

    Key files:
    - `src/main.tsx` — app bootstrap
    - `src/App.tsx` — top-level app component
    - `src/router/AppRouter.tsx` — app routes

    ## Development tips
    - Linting and formatting are available via the workspace configs. Run the project's lint scripts if provided.
    - To test Firebase features locally, ensure your `.env` matches your Firebase project and that Storage rules allow your test user.
    - For AI-related features, review `src/ai/geminiAI.ts` and the API clients in `src/api/`.

    ## Contributing
    - Create a branch named `feat/description` or `fix/description`.
    - Open a PR with a clear description and link to related issues.

    ## Next steps I can help with
    - Add an `.env.example` file with the exact keys used.
    - Add usage screenshots or GIFs to the README.
    - Create a short local setup script to simplify onboarding.

    ---

    If you'd like, I can run the dev server, add an `.env.example`, or add screenshots to this README — tell me which and I'll proceed.
