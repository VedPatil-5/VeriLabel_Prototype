# VeriLabel product requirements

## 1. Product summary

VeriLabel is a prototype interface for inspecting packaged-commodity labels against a prepared set of Legal Metrology and related declaration checks. It demonstrates how a customer or a Legal Metrology officer might move from a product image to a structured review containing visible declarations, potential findings, compliant elements, corrective actions, and a downloadable dossier.

The prototype supports the experience and data model only. It does not make an official legal determination, store real inspections, or provide secure officer identity management.

## 2. Users and needs

### Customer

Needs a simple, guided way to choose a product label, understand what the system checks, see findings in plain language, and download a shareable summary.

### Prototype officer

Needs a role-specific dashboard shell with sample inspection records, sample analytics, evidence/report affordances, and access to the same scan and team actions as a customer.

### Demonstration stakeholder

Needs a consistent visual system, multilingual labels, light/dark themes, realistic sample cases, and clear prototype boundaries for presentations and evaluation.

## 3. Goals

- Demonstrate a complete customer scan-to-report journey with deterministic local data.
- Demonstrate an officer workspace without duplicating customer scanner/team behaviour.
- Make the distinction between violations, compliant elements, and corrective action clear.
- Support English, Hindi, and Marathi UI copy while preserving `VeriLabel` unchanged.
- Keep light and dark modes readable and independently styled.
- Provide local assets and reproducible fixtures so the demo works without a backend.

## 4. Non-goals

- Production OCR, computer vision, or camera capture.
- Official legal advice, enforcement decisions, or certified compliance.
- Real officer authentication, authorisation, or audit logging.
- Live government statistics, real penalty calculation, or case management.
- Server-side report storage or multi-user collaboration.

## 5. Supported journeys

### Customer journey

`/` → Customer → `/customer` → Scan the Product → choose library image → simulated pipeline → result dossier → optional PDF → choose another image or Meet the Team.

### Officer journey

`/` → Officer → `/officer` → demo login → `/officer/dashboard` → dashboard action → shared `/officer/scan` or `/officer/team` → logout → `/`.

## 6. Functional requirements

### FR-01: Role selection

The public landing page shall offer Customer and Officer entry points and explain that the application is a prototype.

### FR-02: Customer home

The customer home shall provide the homepage video, a four-step explanation, shared language/theme controls, and exactly one dashboard entry point each for Scan the Product and Meet the Team.

### FR-03: Sample inspection

The scanner shall allow a user to choose from the six local sample fixtures, show processing feedback, display the selected image, and render fixture-provided overlays and findings after the simulated pipeline completes.

### FR-04: Results and report

The result view shall separate violations from compliant elements, show corrective actions where provided, and allow a client-side PDF generated from the selected fixture.

### FR-05: Officer workspace

The officer workspace shall show prototype dashboard statistics, recent inspection records, charts/tables, and actions leading to the shared scanner and team surface.

### FR-06: Demo auth and logout

The officer demo shall accept the configured client-side demonstration credentials, protect officer routes within the browser session, and return to the public landing page on logout.

### FR-07: Assistant

The assistant shall accept a question, return a prepared source-linked answer for a recognised keyword, and show a clear no-match/disclaimer state otherwise.

### FR-08: Internationalisation and theme

The application shall support English, Hindi, and Marathi strings; preserve the brand name; persist language and theme independently; and keep all visible states readable in both themes.

### FR-09: Team

Customer and officer views shall use the same six-member order, local photos, and name-matched GitHub/LinkedIn mapping. An unavailable GitHub profile may use a visible placeholder.

## 7. Non-functional requirements

- Responsive from mobile widths through desktop layouts.
- Keyboard-accessible buttons, links, forms, dialogs, and focus states.
- No frontend secrets.
- Clear distinction between fixture content, source links, and authoritative legal material.
- Deterministic local data for repeatable demonstrations.
- Buildable with the repository’s standard npm scripts.
- Theme-specific contrast for surfaces, text, borders, controls, placeholders, badges, and hover states.

## 8. Acceptance criteria

A feature is ready for this prototype when:

1. the intended route and role entry point work;
2. the shared customer/officer behaviour remains aligned;
3. the empty, loading, success, warning, violation, and error states are understandable;
4. light and dark themes preserve readable contrast;
5. English, Hindi, and Marathi labels do not break the layout;
6. fixture/report copy matches the supplied image and data; and
7. `npm run build` and `git diff --check` pass.

Browser visual inspection, PDF rendering, and accessibility audits are separate checks and should be recorded honestly when performed.

## 9. Future roadmap

1. Add a reviewed backend contract for identity, image storage, OCR, validation, and reports.
2. Replace hardcoded fixtures with versioned, traceable inspection inputs.
3. Add source-version metadata and legal review workflows.
4. Add automated unit, integration, accessibility, visual, and PDF regression tests.
5. Add secure role permissions and immutable audit events before any operational use.
