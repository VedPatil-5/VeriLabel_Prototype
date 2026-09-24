# Customer guide

## 1. Before you begin

VeriLabel is a browser prototype. It uses local sample images and prepared findings, so it can demonstrate the inspection journey without a camera, account, backend, or internet-based OCR service. Use the interface to understand the workflow; do not treat a result as a legal determination.

## 2. Open the customer experience

1. Start the project with `npm run dev` and open the local Vite URL.
2. On the public landing page, select **Customer** and continue.
3. The customer home view contains the main inspection explanation, the homepage video, and two primary actions:
   - **Scan the Product** opens the shared scanner.
   - **Meet the Team** opens the singular team section used by both roles.
4. The header can take you back to the public landing page and provides the language and theme controls.

## 3. Choose language and theme

The controls are available in the shared header. Choose English, Hindi, or Marathi from the language selector. Choose Light or Dark from the theme control. Preferences are stored locally in the browser and are independent of one another.

The Hindi tagline is a transliteration: `एवरी लेबल, वेरिफाइड।`. The brand name remains `VeriLabel` and is not translated.

If a theme appears stale after a development stylesheet change, reload the page once and confirm that the browser is not serving an old Vite asset. The application applies `data-theme="light"` or `data-theme="dark"` to the root HTML element.

## 4. Run a sample inspection

1. Select **Scan the Product**.
2. Select **Choose from Library**.
3. Pick one of the six product images. The library is local; there is no file upload or live camera capture in this prototype.
4. The scanner displays a timed four-stage simulation:
   - image preprocessing;
   - OCR-style extraction;
   - declaration/rule validation; and
   - verdict and bounding-box finalisation.
5. When processing finishes, review the image with overlays and the result sections below it.
6. Use **Choose Another Image** to return to the library.

The result is determined by the selected fixture, not by the quality of the image or by a live OCR pass. Partial-panel images intentionally contain findings such as “not visible in captured frame”; that wording means the fixture does not claim the full package was inspected.

## 5. Library contents

The current library contains these prepared cases:

| Product | Fixture result | What to expect |
| --- | --- | --- |
| Unidentified Tube Product (Partial Label View) | Violation | Missing visible product name, manufacturer details, and net quantity; MRP/date regions remain visible. |
| Casio FX-991CW Scientific Calculator | Violation | Missing distinct month/year of import; importer, country, quantity, and MRP items are shown as compliant. |
| Rajkamal's Namkeen Diet Navratan Mix (200g) | Violation | Dual MRP and ambiguous packing-date findings with compliant label elements. |
| Amul Masti Spiced Buttermilk (Partial Panel) | Violation | Partial view with net quantity and manufacturer/FSSAI findings. |
| Electral ORS Sachet | Violation | Declared powder weight is not visible in the captured panel. |
| Graph-X Mech Pencil (Imported, Tejura Overseas) | Compliant control sample | Full imported-commodity declaration example with no fixture violations. |

The source of truth for names, case references, image paths, findings, and corrective actions is `src/data/samples/`.

## 6. Read the results

The result dossier uses the same structure for every sample:

- **Violations Found** lists fixture findings, severity, explanatory text, and the referenced rule or standard.
- **Compliant Elements** lists declarations that are present in the prepared sample data and shows the value used by the prototype.
- **Download Summary PDF** creates a client-side inspection report from the selected fixture.
- Bounding boxes connect visible regions in the image to labels, details, and rule codes.

The wording “compliant” means “marked compliant in this prototype fixture.” It does not certify the product, replace a complete package inspection, or establish an enforceable legal conclusion.

## 7. Download a report

Select **Download Summary PDF** after processing. The browser downloads a file named `VeriLabel_Inspection_<case-reference>.pdf`. The report is generated locally and contains the product summary, verdict, violations, compliant elements, corrective action plan, and optical-region details available in the fixture.

If generation fails, confirm that the browser allows downloads and that the sample is fully processed. The report generator is a browser-only service; there is no server-side report archive.

## 8. Meet the Team

The team section displays six fixed cards with local images and social links. The card order and photos are shared between customer and officer views. A GitHub placeholder (`#`) is intentionally retained for Jay Shirodkar until a real profile is supplied. Links open in a new tab.

## 9. FAQ assistant

The bottom-right assistant opens a local FAQ dialog. It matches question keywords against a small in-app FAQ list and returns a prepared answer with a source link when a match exists. It can answer about sources, prototype data, reports, and the limits of legal advice. It does not call an AI API and cannot answer arbitrary questions.

## 10. Officer users

Officer users follow the same sample scan and team experience after signing in. The officer dashboard adds prototype inspection tables and charts. Officer logout returns to the public landing page. Dashboard counts and records are demonstrations only.

## 11. Troubleshooting

| Symptom | Check |
| --- | --- |
| Images do not appear | Confirm the app is served from the Vite root and that the referenced `/assets/labels/` or `/assets/team/` file exists under `public/assets/`. |
| Scanner never shows a result | Select a library item and wait for the simulated pipeline to finish; the flow is not instant. |
| PDF does not download | Allow browser downloads and retry after processing completes. Check the browser console for a client-side error. |
| Hindi/Marathi text looks incorrect | Confirm the language selection and that the bundled Devanagari font asset is available. |
| Officer route returns to login | The demo session is stored in `sessionStorage`; log in again in the same browser tab. |
| Theme looks inconsistent | Toggle the theme, reload once, and inspect the root `data-theme` attribute. |
