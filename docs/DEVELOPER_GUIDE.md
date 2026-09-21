# Developer guide

Install dependencies with `npm install`, run locally with `npm run dev`, build with `npm run build`, and preview with `npm run preview`.

Routes are resolved in `src/App.tsx`. Translation keys live in `src/i18n/index.tsx`; add the same key to English, Hindi, and Marathi. Theme state lives in `src/context/ThemeContext.tsx`. Officer prototype records live in `src/data/officerPrototypeData.ts`. Report generation lives in `src/services/pdfService.ts`.

Do not put secrets in the frontend. Treat demo auth, evidence references, analytics, and legal assistant content as prototype-only until a backend and verified source registry exist.
