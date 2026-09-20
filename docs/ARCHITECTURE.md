# Architecture

Frontend-only Vite/React/TypeScript application. There is currently no backend, database, API, live OCR service, or secure authentication service.

Main layers:

- `src/App.tsx`: lightweight route resolver and customer/officer shells.
- `src/context`: independent theme and language persistence.
- `src/pages`: role selection, officer auth, officer dashboard.
- `src/components`: shared header, navigation, scanner, results, team, assistant, and dashboard UI.
- `src/data`: static sample and prototype officer records.
- `src/services/pdfService.ts`: client-side jsPDF report generation.

Tesseract, QR, barcode, and camera capabilities are not currently wired into the visible flow; scanning remains a simulated sample workflow.
