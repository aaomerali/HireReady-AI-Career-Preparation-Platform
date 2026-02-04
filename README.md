# 🚀 HireReady

HireReady is a modern **React + TypeScript (Vite)** web application for **interview preparation and resume analysis**.  
It combines AI-powered interview practice, resume feedback, session recording, and job search tools into one platform.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Development Tips](#development-tips)
- [Contributing](#contributing)

---

## ✨ Features

- 🤖 AI-assisted interview practice & answer evaluation  
- 🎥 Save and review recorded interview sessions  
- 📄 Resume upload, parsing, and detailed feedback reports  
- 📚 Interview templates & question banks  
- 🔐 Firebase authentication & file storage  

<<<<<<< HEAD
```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
---

## 🧰 Tech Stack

**Frontend**
- React
- TypeScript
- Vite

**Styling**
- Tailwind CSS

**State Management**
- Redux Toolkit

**Backend / APIs**
- Internal API clients (`src/api/`, `src/services/`)

**Authentication & Storage**
- Firebase

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm / pnpm / yarn

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🔐 Environment Variables

This project uses **Firebase**.

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=messaging_sender_id
VITE_FIREBASE_APP_ID=app_id
```

Firebase config is loaded from:

```
src/firebase/config.ts
```

---

## 📁 Project Structure

```text
src/
 ├── pages/          # Route-based pages
 ├── components/     # Reusable UI components
 ├── api/            # API clients
 ├── services/       # Service wrappers
 ├── firebase/       # Auth & storage helpers
 ├── redux/          # Store & slices
 ├── utils/          # AI helpers, PDF extraction, etc.
 ├── main.tsx        # App bootstrap
 ├── App.tsx         # Root component
 └── router/
     └── AppRouter.tsx
```

---

## 💡 Development Tips

- Run lint scripts if configured to keep code clean  
- Ensure Firebase rules allow test users during development  
- Review AI logic in:

```
src/ai/geminiAI.ts
src/api/
```

---

## 🤝 Contributing

1. Create a branch:

```bash
feat/your-feature-name
fix/your-fix-name
```

2. Open a Pull Request with:
- Clear description
- Linked issue (if any)

---



⭐ If you find this project useful, consider giving it a star!
>>>>>>> 629a23c0346226a0bc55f4a79fbac52d45cf154b
