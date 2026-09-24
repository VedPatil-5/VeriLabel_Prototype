# Developer guide

## 1. Development contract

The repository is a Vite/React/TypeScript frontend. Keep the prototype honest: do not present fixture results as live OCR, do not add secrets to client code, and do not describe demo authentication as secure authentication. Changes that affect legal wording, rule references, sample findings, or officer records require source review and a clear prototype label.

## 2. Prerequisites and commands

Install a current Node.js/npm toolchain, then run:

```bash
npm install
npm run dev
```

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run TypeScript checking and create the production bundle. |
| `npm run preview` | Serve the built bundle locally for a production-style check. |

There is no backend command, database migration, or environment-secret setup in this prototype.

## 3. Repository map

```text
src/App.tsx                    route resolver and shared shell
src/components/                reusable UI and workflow components
src/context/ThemeContext.tsx   theme state and local persistence
src/data/presets.ts            sample and team registries
src/data/samples/*.json        inspection fixtures
src/data/legalSources.ts       assistant FAQ/source records
src/data/officerPrototypeData.ts static officer records
src/i18n/index.tsx             locale values and provider
src/pages/                     role selection, auth, dashboard
src/services/pdfService.ts     client-side report generation
src/types/index.ts             SampleDataset and shared interfaces
src/index.css                  global tokens and light/dark mappings
public/assets/                 runtime-served image, font, logo, seal, and video assets
docs/                          project documentation
```

## 4. Routing and navigation

`App.tsx` resolves `window.location.pathname` and renders the appropriate page. It listens for `popstate`, uses `pushState` for role navigation, and uses hash state for customer tabs. Officer scan/team routes are explicit paths so that the shared shell can return to `/officer/dashboard`.

When adding a route, update all of the following together:

1. the resolver in `src/App.tsx`;
2. the protected-route condition if the route is officer-only;
3. the relevant navigation callbacks;
4. the route table in `README.md` and `docs/ARCHITECTURE.md`; and
5. the customer/officer acceptance checklist in `docs/Task.md`.

Avoid creating a second implementation of shared scan/team behavior for a role. The current design intentionally uses `DashboardActions`, `ScannerTab`, and `TeamTab` as shared surfaces.

## 5. Adding or changing a sample fixture

Create or update a JSON file in `src/data/samples/` using the `SampleDataset` contract from `src/types/index.ts`. A complete fixture should provide:

- a stable `id` and readable `caseReference`;
- product `name`, `category`, `netQuantity`, `mrp`, and `mfgDate`;
- an `imagePath` and optional `thumbnailUrl` that resolve under `public/`;
- `summary`, `badgeText`, and `defaultStatus` (`COMPLIANT`, `VIOLATION`, or `WARNING`);
- `boundingBoxes` with percentage coordinates, labels, colours, details, and optional rule codes;
- `violations` with stable ids, severity, descriptions, and rule text;
- `compliant` entries with labels, displayed values, and descriptions; and
- `changeLog` actions tied to a violation or an auditor note.

Register the fixture import and add it to `SAMPLE_DATASETS` in `src/data/presets.ts`. Add the image under `public/assets/labels/`. Keep the result text tied to what is actually visible in the supplied image; for partial views, say that an item is not visible rather than claiming it is absent from the complete package.

## 6. Report generation

`generateInspectionPdf` in `src/services/pdfService.ts` receives a `SampleDataset` and the active language. It builds the report entirely in the browser and saves it as `VeriLabel_Inspection_<case-reference>.pdf`.

If you add a report field:

1. add it to the fixture/type if it is product data;
2. add translated labels to all supported locales if it is UI/report copy;
3. preserve page-break and footer behavior in the PDF service;
4. test both violation and compliant samples; and
5. check that Devanagari output remains readable in the selected locale.

The generated document is a prototype inspection dossier. Do not label it an official filing unless a future reviewed integration explicitly establishes that status.

## 7. Translation workflow

Translation keys live in the `translations` object in `src/i18n/index.tsx`. Add the same key to English, Hindi, and Marathi. Preserve the exact `VeriLabel` brand spelling in every locale. The Hindi tagline should remain the requested transliteration `एवरी लेबल, वेरिफाइड।`, not a semantic translation.

Use `useI18n()` in React components rather than hard-coding user-facing copy. If a legal reference is intentionally fixed in a fixture or report, make that distinction clear in documentation.

## 8. Theme and styling rules

Theme state is applied by `ThemeProvider` through `data-theme`. Global semantic tokens are defined in `src/index.css` for surface, card, border, text, muted text, primary colour, and status colours. Light and dark themes are separate palettes; dark mode is not a blanket inversion.

When changing a component:

- inspect the light and dark surface behind every text colour;
- use semantic variables for new shared surfaces and text;
- give inputs, placeholders, selects, badges, borders, and hover states explicit dark behaviour;
- keep focus indicators visible in both themes;
- retain the light palette unless the requested change is light-mode related; and
- check mobile widths and long translated labels.

The “What VeriLabel Does” step titles and descriptions must both retain readable contrast. Avoid reintroducing a fixed white title on a light card or a fixed dark title on a dark surface.

## 9. Assets and team data

Runtime public assets are referenced with root-relative URLs such as `/assets/labels/product-1.jpeg`. Team data is kept in the same order as the visible cards in `TEAM_MEMBERS`. If a social profile is unavailable, keep the icon visible and use the agreed placeholder rather than swapping another member’s URL.

The team image directory is ignored by Git according to the current repository policy, while already tracked assets may still appear in version control. Do not silently reorder cards or replace photos when only social links are requested.

## 10. Officer data and legal content

Officer dashboard records are in `src/data/officerPrototypeData.ts`. Keep sample identifiers, Mumbai scope, penalty examples, and evidence hashes clearly marked as prototype content. Never add personal data, real enforcement records, or invented statistics to client fixtures.

Legal sources and FAQ references are in `src/data/legalSources.ts`. The assistant should link to a source and state its limitations. Any rule interpretation, penalty amount, or enforcement recommendation must be reviewed against the current authoritative text before being used beyond the prototype.

## 11. Verification checklist

At minimum, run:

```bash
npm run build
git diff --check
```

Then manually exercise:

- public role selection and customer entry;
- customer home, scanner, library selection, result accordions, PDF button, and team links;
- officer login, dashboard actions, scanner/team routes, and logout to `/`;
- light and dark themes on every route;
- English, Hindi, and Marathi strings, including the tagline and PDF labels;
- keyboard focus, form labels, dialog dismissal, disabled/loading states, and mobile widths; and
- broken-image, no-match assistant, and PDF-error states where practical.

Browser automation and PDF visual rendering are separate acceptance activities. Do not claim them complete unless the relevant environment is available and the result has been inspected.
