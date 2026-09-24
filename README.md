# VeriLabel

VeriLabel is a frontend-only prototype for guided packaged-commodity label inspection. It presents a customer scanning flow and a prototype Legal Metrology officer workspace for reviewing sample findings, optical regions, compliance items, and client-generated inspection reports.

## What the prototype demonstrates

- A role-selection landing page for Customer and Officer journeys.
- A customer home experience with a homepage video, shared theme/language controls, and the `Scan the Product` and `Meet the Team` actions.
- A six-item product image library. Selecting an item runs a timed, simulated preprocessing → OCR → rule-validation → verdict sequence.
- Product-specific bounding boxes, violations, compliant elements, corrective actions, and case references loaded from local JSON fixtures.
- A client-side PDF inspection dossier generated with jsPDF from the selected fixture.
- An officer login and dashboard backed by intentionally static prototype records, including Mumbai-labelled sample analytics.
- A small source-linked FAQ assistant that answers recognised local keywords without making a network or AI API request.
- Light and dark themes, English/Hindi/Marathi UI strings, local team portraits, social links, and an autoplay homepage video.


## Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Role selection / landing page | Public |
| `/customer` | Customer home | Public |
| `/customer#scanner` | Customer scanner | Public |
| `/customer#team` | Customer team section | Public |
| `/officer` | Officer demo login | Public |
| `/officer/dashboard` | Officer prototype dashboard | Demo session required |
| `/officer/scan` | Shared scanner in officer mode | Demo session required |
| `/officer/team` | Shared team section in officer mode | Demo session required |

Officer logout clears the demo session and returns to `/`, the public landing page.

## Quick start

Requirements: Node.js with npm available on the development machine.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production-style check:

```bash
npm run build
npm run preview
```

## Main user flows

### Customer

1. Open `/` and select Customer.
2. On the customer home view, choose `Scan the Product` or use the header navigation.
3. Choose one of the six local sample images.
4. Wait for the simulated pipeline to complete.
5. Review the image overlays, violations, compliant elements, and corrective action details.
6. Download the client-generated summary PDF, or choose another image.
7. Open `Meet the Team` from the home action or header profile control.

### Officer

1. Open `/` and select Officer.
2. Use the demo credentials or the auto-fill control on `/officer`.
3. Review the clearly labelled prototype dashboard.
4. Use the dashboard actions to open the same scanner and team experiences available to customers.
5. Use the header logout control to return to `/`.

## Sample library

The fixtures are stored in `src/data/samples/` and are imported by `src/data/presets.ts`.

| Fixture | Case reference | Product | Default result |
| --- | --- | --- | --- |
| `sample1` | `VL-SAMPLE2-0621` | Unidentified Tube Product (Partial Label View) | Violation |
| `sample2` | `VL-SAMPLE3-8830` | Casio FX-991CW Scientific Calculator | Violation |
| `sample3` | `VL-SAMPLE4-1614` | Rajkamal's Namkeen Diet Navratan Mix (200g) | Violation |
| `sample4` | `VL-SAMPLE5-1851` | Amul Masti Spiced Buttermilk (Partial Panel) | Violation |
| `sample5` | `VL-SAMPLE6-2360` | Electral ORS Sachet | Violation |
| `sample6` | `VL-SAMPLE7-0021` | Graph-X Mech Pencil (Imported, Tejura Overseas) | Compliant control sample |

Each fixture owns its product metadata, image path, bounding boxes, violations, compliant elements, and change log. Keep those fields aligned when adding a new sample; see [the developer guide](docs/DEVELOPER_GUIDE.md).

## Project structure

```text
src/
  App.tsx                 route resolver and shared customer/officer shell
  components/             header, dashboard actions, scanner, results, team, assistant
  context/                theme state and persistence
  data/                   sample fixtures, officer prototype records, FAQ sources
  i18n/                   English, Hindi, and Marathi strings
  pages/                  role selection, officer auth, officer dashboard
  services/               client-side PDF generation
  types/                  shared TypeScript models
public/assets/            product labels, team portraits, logo, seal, homepage video
docs/                     project, product, design, compliance, and contributor documentation
```

## Theme, language, and persistence

Theme and language are independent React providers. The theme is applied through `data-theme` on the root HTML element and persisted under `verilabel:theme`; language is persisted under `verilabel:language`. The demo officer session uses `verilabel:officer` in `sessionStorage`. These values are convenience state for the prototype and are not an authentication or account system.

The light theme keeps the existing lilac/white surface system. The dark theme uses separate navy surfaces, borders, text, controls, status colours, input states, and hover states. Do not implement theme changes by changing only a single foreground colour or by inverting the light palette.

## Validation and contribution notes

Before handing off a change:

```bash
npm run build
git diff --check
```

Also exercise the affected route in both themes, check keyboard focus and mobile widths, and confirm that no secrets or unverified legal claims are added to the frontend. Keep demo data and fixture findings visibly distinguishable from authoritative source material.

## Documentation index

- [Architecture](docs/ARCHITECTURE.md) — runtime structure, routes, data flow, and boundaries.
- [Customer guide](docs/CUSTOMER_GUIDE.md) — end-user walkthrough and troubleshooting.
- [Design system](docs/DESIGN.md) — visual language, themes, responsive rules, and accessibility.
- [Developer guide](docs/DEVELOPER_GUIDE.md) — setup, extension points, and verification.
- [Product requirements](docs/PRD.md) — prototype scope, journeys, requirements, and roadmap.
- [Rules and validation](docs/RULES.md) — legal-content, data, and wording guardrails.
