# VeriLabel implementation plan

Status: approved by the user on 2026-09-20. Implementation is now authorized.

Prepared from repository inspection on 2026-09-20. The pasted implementation brief is treated as the requested specification, not as existing application behavior.

## 1. Guardrails

VeriLabel remains the same prototype product with the motto “Every Label, Verified.” This is an additive enhancement, not a redesign. The current customer workflow, light visual language, sample scanning behavior, card/button language, typography, and spacing remain the baseline.

- Customer functionality remains available through the new role-selection page.
- Officer features are prototype UI/workflow features unless an existing real capability is found.
- Sample values are always labeled sample/prototype; they are never presented as verified government statistics.
- Legal text is shown only after source review. AI explanations are not statutory conclusions or legal advice.
- Supported languages are exactly English, Hindi, and Marathi; English is the default.
- Reuse existing components before adding new ones.
- If implementation must materially diverge from this plan, update this file before making the divergence.

## 2. Current project inspection

### 2.1 Repository structure

    index.html                    Vite document shell, fonts, title/meta
    package.json / lock           React/Vite/Tailwind/jsPDF/Tesseract/etc.
    vite.config.ts                Vite + React + Tailwind v4; port 3000
    tsconfig.json                 Strict TypeScript, bundler resolution
    README.md                     Short prototype description
    eng.traineddata               OCR data file; not referenced by source
    assets/                       inspector_avatar.png, official_seal.png
    public/assets/                duplicated avatar/seal and three local labels
    src/main.tsx                  React StrictMode entrypoint
    src/App.tsx                   single-screen tab shell and global FAB/nav
    src/index.css                Tailwind import, light theme tokens, base CSS
    src/types/index.ts            sample/violation/bounding-box/team types
    src/data/presets.ts           six sample datasets and six remote team records
    src/data/samples/*.json       static inspection fixtures
    src/services/pdfService.ts    client-side jsPDF generator
    src/components/              Header, BottomNav, OverviewTab, ScannerTab,
                                  ResultsPanel, TeamTab, ChatbotFab, PhotosGrid,
                                  ActionSheet, PipelineStepper, BoundingBoxOverlay,
                                  PrototypeBadge

The working tree was clean. node_modules and dist are absent, so dependency installation/build verification was not run during planning. No test suite exists.

### 2.2 Architecture findings

- Frontend only: React 19, TypeScript, Vite 8.
- Styling: Tailwind v4 through the Vite plugin plus CSS variables in index.css. Most surfaces/colors are hard-coded for light mode.
- State: local React useState only. There is no context, reducer, global store, route state, language state, or theme state.
- Routing: none. App.tsx switches in-memory between home, scanner, and team tabs.
- Backend/database/API: none found. There is no server code, fetch/axios usage, environment-variable access, or persistence layer.
- OCR/QR/barcode/camera/upload: dependencies/assets suggest future intent, but current source does not call Tesseract, read QR/barcode, use camera, or upload arbitrary images. The visible pipeline is simulated.
- Compliance: six JSON fixtures supply displayed findings. There is no separate rule-engine module.
- Reports: jsPDF is used client-side; the service both saves and returns a Blob.
- Assets: label images are local, team/assistant images use remote URLs, and the supplied new_logo.PNG is outside this repository.
- Legal/data: fixture rules have no source registry/effective date. Some claims must be reviewed before officer use.

### 2.3 Existing reusable components

Header, BottomNav, OverviewTab, ScannerTab, ResultsPanel, TeamTab, ChatbotFab, PhotosGrid, ActionSheet, PipelineStepper, BoundingBoxOverlay, and PrototypeBadge are all reusable candidates. TeamTab already maps all six team records from one data array and should become a shared TeamGrid/TeamCard rather than being duplicated for Officer. ScannerTab and its children should power both customer and officer inspection flows.

### 2.4 Existing customer flow

    App mount
      -> home / OverviewTab
      -> scanner / ScannerTab
      -> choose a sample from PhotosGrid
      -> 3.6-second simulated pre-processing/OCR/rules/verdict
      -> bounding boxes and ResultsPanel
      -> client-side PDF download
      -> team / TeamTab

PhotosGrid currently displays samples.slice(0, 5), although six fixtures exist. This is a current behavior to preserve or deliberately resolve during implementation; it must not change silently. There is no real camera capture or arbitrary file upload today, so any new upload surface must be labeled prototype unless real analysis is implemented.

### 2.5 Existing language/theme/report state

No i18n exists: user-facing strings are hard-coded in components, fixture JSON, index.html, and pdfService.ts. There are no Hindi/Marathi translations or persistence. Source strings contain mojibake such as â‚¹, â€¢, and Â©.

No theme toggle or dark mode exists. Light mode uses an approximately #faf8ff surface with blue/navy/teal/green/red semantic colors.

pdfService.ts has manual y-positioning, some splitTextToSize wrapping, fixed-height cards, and manual page breaks. Known defects include:

- Helvetica cannot render Devanagari; current ASCII cleanup destroys multilingual fidelity.
- Metadata product text uses only the first wrapped line.
- Fixed card heights can clip content after wrapping.
- No actual PDF render/text inspection exists.
- Hard-coded English report labels cannot follow application locale.
- doc.save inside the service makes testing/caller control harder.

### 2.6 Dashboard/badge/presentation findings

There is no officer dashboard, authentication, officer data model, analytics, penalty tracker, repeated-offender tracker, evidence ledger, or report list.

No LM-MH-042 string was found. It will be preserved as an informational reference if its location is identified; no interpretation will be invented.

No SIH presentation file was found in the repository or supplied attachment directory. The user confirmed that it is not needed, so the officer requirements below are based on the pasted brief and current code.

## 3. Target architecture

### 3.1 Routes and shells

Preferred route structure:

    /                  RoleSelectionPage
    /officer           OfficerAuthPage
    /officer/dashboard OfficerDashboardPage
    /officer/scan      Shared inspection flow
    /customer          Existing customer shell

Use react-router-dom if approved for clean deep links, redirects, and protected officer routes. A History API adapter is the fallback if avoiding a dependency is mandatory. Extract the current customer tabs into CustomerPage/CustomerShell with minimal behavior changes.

### 3.2 Shared state

Add:

- ThemeProvider: light/dark, localStorage key verilabel:theme, document theme attribute/class.
- I18nProvider: en/hi/mr, localStorage key verilabel:language, typed t(key, params), document lang.
- Prototype auth/session guard: sessionStorage-only demo flag, never described as secure authentication.
- AppShell/shared header controls: logo, motto, language selector, theme toggle, route-aware officer/customer actions.

Theme and language use independent storage keys and must never reset each other.

### 3.3 Central translations

Create a typed catalog for exactly en, hi, mr. Keys cover navigation, roles, authentication, dashboard, scanner, pipeline, results, reports, evidence, assistant, settings, theme, language, team, prototype labels, statuses, empty/error/success states, and accessibility labels. Move all component-owned strings to t() calls. Add localized wrapper text for sample/result content where it is UI; product names, citations, identifiers, URLs, and hashes may remain exact when they are source material or identifiers. Use Intl date/number formatting by locale.

### 3.4 Theme

Preserve current light mode. Add semantic surface/text/border/primary/status/chart CSS variables with a dark override and refactor new/modified components away from isolated light-only colors as needed. The toggle has visible label, keyboard focus, selected/pressed state, and reduced-motion support. Test forms, tables, charts, cards, modals, and reports UI in both modes.

## 4. Requirement-by-requirement plan

Each item records existing situation, required change, code-change decision, solution, affected files, dependencies, test method, and risk.

### 4.1 Role-selection landing

- Existing: / opens the customer overview directly.
- Required: ask “Are you an Officer or a Customer?” with two clear choices.
- Code changes: Yes.
- Solution: new RoleSelectionPage at / using current brand, logo, motto, palette, typography, and restrained glass/neumorphism cards with subtle hover/focus elevation. Links to /officer and /customer.
- Affected: new page, router, AppShell/Header, i18n/theme.
- Dependencies: router only if approved.
- Test: direct load, keyboard enter/focus, hover, six locale/theme combinations, all viewport sizes.
- Risk: turning this into a redesign; keep current design language.

### 4.2 Customer preservation

- Existing: tab state and customer UI live in App.tsx and current components.
- Required: Customer selection must open the existing customer page without officer login.
- Code changes: Yes, route/shell/provider integration only.
- Solution: extract CustomerPage/CustomerShell around OverviewTab, ScannerTab, and TeamTab; retain current behavior and use shared controls/team/scanner.
- Affected: App.tsx, current customer components, BottomNav, providers/router.
- Dependencies: same router choice.
- Test: role -> customer, all tabs, sample scan, overlays, results, PDF, deep link/refresh.
- Risk: local state resets during extraction; preserve state ownership deliberately.

### 4.3 Officer authentication

- Existing: none.
- Required: Officer ID/email, password, Login, Sign Up, visible demo credentials, valid/invalid behavior.
- Code changes: Yes.
- Solution: OfficerAuthPage compares against constants officer@verilabel.demo / officer123, shows a prototype-credentials callout, stores session-only demo state, redirects to dashboard, and shows localized invalid/empty errors. Sign Up is clearly non-persistent prototype UI.
- Affected: new auth page/context/guard, i18n, shared form styles.
- Dependencies: none beyond router.
- Test: valid/invalid/empty, keyboard labels, protected route, refresh/logout, dark mode/locales.
- Risk: users mistaking demo auth for security; persistent prototype disclaimer required.

### 4.4 Officer dashboard shell

- Existing: none.
- Required: natural extension of current app with overview, recent activity, violations, penalties, repeated offenders, evidence, reports, assistant, analytics.
- Code changes: Yes.
- Solution: responsive OfficerDashboardPage with current blue/navy/teal/status language and persistent “Prototype data” label.
- Affected: new dashboard page/components, shared shell, data/types, i18n/theme.
- Dependencies: no chart library planned; use CSS/SVG.
- Test: protected access, all sections, responsive stacking, no horizontal overflow, all theme/locales.
- Risk: overcrowding/contrast; use compact tables, progressive sections, summaries.

### 4.5 Dashboard data and sections

- Existing: no officer data.
- Required: realistic prototype data for product inspections, compliance, violations, penalty tracking, repeated offenders, reports, evidence.
- Code changes: Yes.
- Solution: typed src/data/officerPrototypeData.ts with separate inspection, violation, penalty, repeated-offender, evidence, and report records plus explicit isPrototypeData/source metadata.
- Overview cards: Total Inspections, Compliant Products, Non-Compliant Products, Violations Detected, Reports Generated.
- Recent inspections: product, time, status, violation status, officer/reference, report availability.
- Violation tracker: detected issue, product/case, legal rule reference, inspection status.
- Penalty tracker: product/case, violation, status, amount only when supported by verified source; otherwise “Not calculated in prototype”.
- Repeated offenders: entity/seller/manufacturer, violation count, recent violation, current status; sample labeling always visible.
- Evidence/audit: image, timestamp, location, audit reference, prototype SHA-256 reference, rule/clause, visual highlights; never claim legal-grade tamper-proof storage without backend.
- Reports: result, violations, evidence, status, PDF action using shared generator.
- Monitoring: readable CSS/SVG charts for compliance, categories, activity, penalty states, repeat violations with text summaries.
- Affected: new dashboard components/data/types, translations, report action.
- Dependencies: none planned.
- Test: representative data and empty states, correct status mapping, keyboard/touch, mobile, accessible chart legends/text.
- Risk: fabricated-looking statistics or penalties; label every record/chart as sample/prototype and omit unsupported amounts.

### 4.6 Officer-to-scanning integration

- Existing: only customer-like ScannerTab; library samples and simulated pipeline.
- Required: dashboard -> scan/upload -> existing analysis -> validation -> result -> evidence -> report.
- Code changes: Yes, shared flow extraction.
- Solution: extract scan state/timers/handlers into useInspectionFlow or InspectionFlow with mode customer/officer; officer route mounts the same components. Keep sample-library behavior honest. If file input is added, validate type/size and label unimplemented server analysis.
- Affected: ScannerTab, new shared flow/page/hook, PhotosGrid, PipelineStepper, BoundingBoxOverlay, ResultsPanel, routes.
- Dependencies: no new OCR/QR library.
- Test: both entry points produce same sample results; cleanup timers on switch/unmount; route back/forward; PDF.
- Risk: duplicated state/stale timers; centralize cleanup.

### 4.7 Logo

- Existing: Header uses a Lucide ScanText icon; no image logo in repo.
- Required: replace only logo with supplied C:\Users\CHETAN\OneDrive\Desktop\Hackathon\SIH 2026\new_logo.PNG.
- Code changes: Yes.
- Solution: after approval copy the highest-quality file to public/assets with stable name, inspect dimensions/transparency, use object-contain/intrinsic aspect ratio, preserve header layout and avoid crop/upscale.
- Affected: Header, landing/shared brand, new asset.
- Dependencies: none.
- Test: sharp at 1x/2x, light/dark, mobile, aspect ratio.
- Risk: external source/canvas size; document containment decision.

### 4.8 Team images and Officer team

- Existing: six records in presets.ts with remote URLs; TeamTab maps shared cards. New Ved image is not in repo/attachment directory as a named file.
- Required: replace only Ved, preserve other five, show all six names/images, add same team section to Officer.
- Code changes: Yes for asset/data/shared component.
- Solution: confirm which supplied inline image is Ved; copy only that asset to public/assets/team without blur/compression/distortion; update ved record; extract TeamGrid/TeamCard and use in both flows.
- Affected: presets.ts, TeamTab, new shared team components/asset, officer page, i18n.
- Dependencies: none.
- Test: six distinct correct cards, Ved sharpness, image fallback, responsive parity.
- Risk: inline image-to-person mapping is ambiguous; do not guess. Remote asset availability remains a known risk.

### 4.9 Multilingual support and persistence

- Existing: none; hard-coded English and mojibake.
- Required: exactly English/Hindi/Marathi dropdown, complete coverage, persistence through customer/officer journey and PDF.
- Code changes: Yes.
- Solution: typed catalogs, t(), localized statuses/labels/toasts/forms/errors, localized sample/result wrapper text, Intl formatters, missing-key development warnings.
- Affected: all current/new components, fixture localization mapping, PDF service, index.html document language.
- Dependencies: none planned.
- Test: switch locale on every screen/modal, refresh/navigation persistence, no untranslated UI, long Devanagari wrapping.
- Risk: partial coverage/awkward translations; treat missing keys as release failures and review native wording.

### 4.10 Light/dark mode

- Existing: light-only hard-coded classes.
- Required: repair toggle/persistence across all pages/modals and independently from language.
- Code changes: Yes.
- Solution: ThemeProvider, semantic CSS variables/dark variants, shared accessible toggle, preserve light baseline.
- Affected: index.css, index.html, App/Header, all new/modified UI.
- Dependencies: none.
- Test: six locale/theme combinations, reload/nav persistence, contrast/focus/hover/disabled/chart/table/form/modal.
- Risk: light regression during token refactor; compare existing customer screens before/after.

### 4.11 Floating Officer Assistant

- Existing: ChatbotFab is fixed bottom-right above bottom nav, opens “Coming Soon” panel, and is mounted globally.
- Required: circular bottom-right button, accessible/responsive/non-obstructive, Officer Assistant in Officer experience.
- Code changes: Yes.
- Solution: retain component, use safe-area/route-aware offsets, translated labels, prototype disclaimer, and a source-labeled officer panel. Use only curated verified source snippets or an explicit source-not-connected state; never generate unsupported legal advice. Customer may retain placeholder.
- Affected: ChatbotFab, new assistant data/panel, AppShell, i18n/theme.
- Dependencies: no live AI/API planned.
- Test: keyboard/modal close, mobile safe area, no content obstruction, locale/theme, scroll.
- Risk: legal hallucination or nav overlap; use bounded content and accessible positioning.

### 4.12 PDF formatting and multilingual PDF

- Existing: manual jsPDF cursor/fixed cards/English/Helvetica/ASCII cleanup.
- Required: wrapping, tables, headings, margins, multipage output, no clipping/overlap, localized English/Hindi/Marathi with Devanagari.
- Code changes: Yes.
- Solution:
  1. Refactor pdfService into measured ensureSpace, wrapped-text, section-header, table-row, footer/header helpers.
  2. Accept a localized report model and locale; remove hard-coded English labels.
  3. Bundle/register a properly licensed Noto Sans Devanagari (or approved equivalent) in jsPDF VFS; do not destroy valid Unicode.
  4. Keep citations, case IDs, URLs, and hashes exact while translating surrounding labels.
  5. Return Blob; let caller control download.
  6. Test long names/descriptions, empty sections, multiple violations, and multi-page reports.
- Affected: pdfService, translations/formatters, scanner/results action, font asset or approved font dependency.
- Dependencies: existing jsPDF plus licensed Unicode font asset/package.
- Test: generate English/Hindi/Marathi compliant/violation PDFs, extract text, render actual files to PNG, inspect bounds/glyphs/download filenames.
- Risk: font licensing/size and changed metrics; actual file inspection is mandatory.

### 4.13 Legal accuracy and real-world data

- Existing: embedded rule claims have no source metadata; no geography/live data.
- Required: accurate verifiable legal information and no fabricated real-world analytics.
- Code changes: Yes for source metadata/disclaimers; no live data until geography/source/API are specified.
- Solution: source registry with title, official URL, jurisdiction, review date, and classification (statute, guidance, sample, AI explanation). Review all fixture rules before officer use. Prefer official Department of Consumer Affairs sources:
  - https://consumeraffairs.nic.in/acts-and-rules/legal-metrology/the-legal-metrology-act-2009
  - https://consumeraffairs.nic.in/sites/default/files/file-uploads/latestnews/LM_PCR_All_Amendements.pdf
  - https://consumeraffairs.nic.in/legalmetrologyactsandrules/legal-metrology-packaged-commodities-amendment-rules-2023-2
  - https://consumeraffairs.nic.in/weightsmeasures/weight-and-measures
  Keep analytics as “Prototype sample data” until an area-specific verified source is available. Display “Source unavailable / not calculated” instead of inventing facts or amounts.
- Affected: new legalSources module, reviewed fixtures/rules, assistant, dashboard, docs/RULES.md.
- Dependencies: none.
- Test: provenance review, visible sample badges, no unsupported penalties, assistant labels source vs explanation.
- Risk: rules/amendments change and fixtures may be oversimplified; re-review before implementation sign-off.

### 4.14 Security

- Existing: static client-only prototype, no secrets/backend/auth, sample selection only.
- Required: proportional protections, no exposed secrets/fake security.
- Code changes: Yes for validation/boundaries; backend security is out of scope.
- Solution: validate any new file input by type/size; no unsanitized HTML; no API keys/client secrets; UI-only route guard; clear session on logout; generic errors; document limitations. If backend is later added, require server-side authz, rate limits, input validation, secure secrets, audit storage, and server-side evidence hashing.
- Affected: auth guard, upload if approved, error handling, docs.
- Dependencies: none.
- Test: invalid/oversized input, malformed route/session, secret scan, safe error behavior.
- Risk: prototype mistaken for enforcement infrastructure; keep disclaimers visible.

### 4.15 Targeted refactoring

- Existing: repeated raw palette values, team card markup in TeamTab, tab-only state in App, hard-coded strings, scanner timers/toasts coupled to view, duplicated assets.
- Required: improve maintainability without blind rewrite.
- Code changes: Yes, targeted.
- Solution: extract AppShell, TeamGrid/Card, inspection-flow hook, shared status/card primitives only where they reduce duplication; centralize translations/theme tokens/data/report helpers.
- Affected: App, team/scanner/header/nav/results/report files and new shared modules.
- Dependencies: none beyond router.
- Test: type/build checks, customer regression, light visual comparison.
- Risk: extraction behavior changes; implement in small milestones and verify each.

### 4.16 Documentation

- Existing: short README only.
- Required: docs/PRD.md, ARCHITECTURE.md, RULES.md, DESIGN.md, Task.md, MEMORY.md, DEVELOPER_GUIDE.md, CUSTOMER_GUIDE.md.
- Code changes: No application code; documentation files after approval.
- Solution: document actual implemented routes/features, source dates, prototype limitations, design tokens, language/theme keys, reports/fonts, setup/testing, customer instructions, and future backend work. Never mark unimplemented work complete.
- Affected: new docs folder and optional README update.
- Dependencies: none.
- Test: link/path and source-to-doc consistency audit.
- Risk: documentation drift; update as milestones land.

## 5. Files to create after approval

Likely files:

    docs/PRD.md, ARCHITECTURE.md, RULES.md, DESIGN.md, Task.md,
    MEMORY.md, DEVELOPER_GUIDE.md, CUSTOMER_GUIDE.md
    src/app/AppRouter.tsx, AppShell.tsx
    src/context/ThemeContext.tsx, I18nContext.tsx
    src/i18n/translations.ts, formatters.ts
    src/auth/PrototypeAuthContext.tsx
    src/pages/RoleSelectionPage.tsx, OfficerAuthPage.tsx,
    src/pages/OfficerDashboardPage.tsx, OfficerScanPage.tsx, CustomerPage.tsx
    src/components/LanguageSelector.tsx, ThemeToggle.tsx,
    src/components/TeamGrid.tsx, TeamCard.tsx
    src/components/dashboard/*
    src/components/assistant/OfficerAssistant.tsx
    src/data/officerPrototypeData.ts, legalSources.ts,
    localizedSamples.ts or equivalent
    src/hooks/useInspectionFlow.ts if extraction is approved
    public/assets/verilabel-logo.*
    public/assets/team/ved-patil.*
    public/fonts/NotoSansDevanagari-*.ttf or approved equivalent

Exact filenames may be adjusted to match the existing code style. No file in this list will be created before approval except this plan.

## 6. Files likely to modify after approval

App.tsx, index.css, index.html, Header.tsx, BottomNav.tsx, OverviewTab.tsx, ScannerTab.tsx, ResultsPanel.tsx, PipelineStepper.tsx, PhotosGrid.tsx, ActionSheet.tsx, BoundingBoxOverlay.tsx, TeamTab.tsx, ChatbotFab.tsx, PrototypeBadge.tsx, presets.ts, types/index.ts, pdfService.ts, and package.json/package-lock.json only if an approved dependency is justified. README changes are optional and must reflect actual implementation.

## 7. Dependency decisions

Reuse existing React, Vite, TypeScript, Tailwind, Lucide, jsPDF, Tesseract.js, html2canvas, and canvas-confetti. Proposed additions are only react-router-dom for clean routes and a licensed Unicode Devanagari font asset/package for PDF output. No chart, auth, backend, database, AI, OCR, QR, barcode, or state-management package is planned unless the approved implementation proves it necessary.

## 8. Responsive and accessibility plan

- Retain mobile-first layout; dashboard columns collapse to stacked sections.
- Keep header controls compact with a narrow-screen grouping/menu if required.
- Language/theme controls have visible names, selected state, keyboard focus, and Escape/outside-click handling.
- Use semantic headings/labels, status text in addition to color, table headers, chart summaries, dialog labels, and alt text.
- Respect prefers-reduced-motion.
- Use safe-area-aware bottom nav/FAB spacing; FAB never covers primary content on mobile.
- Test desktop, laptop, tablet, narrow mobile, keyboard-only use, and larger text/zoom.

## 9. Implementation sequence after approval

1. Use the pasted brief as the authoritative officer requirements; use the newly supplied portrait as the Ved Patil replacement and Mumbai as the prototype analytics geography.
2. Install existing dependencies and record baseline build/runtime result.
3. Copy/verify logo and Ved asset only; record dimensions/licenses.
4. Add translation/theme providers and shared controls while preserving customer behavior.
5. Extract customer shell and shared team/inspection primitives.
6. Add routes and role selection; re-test customer flow.
7. Add officer auth/guard and dashboard shell with prototype labels.
8. Add typed dashboard data/sections/analytics/evidence/report links.
9. Connect officer scan route to shared inspection flow.
10. Move/refine assistant and add source-labeled prototype interaction.
11. Rework Unicode/multilingual PDF layout and actual file verification.
12. Review fixture legal claims against official sources; update RULES.md with verified content only.
13. Add requested documentation from actual implementation.
14. Run build/type, route, language/theme, responsive, accessibility, asset, security, and actual-PDF checks.
15. Review diff for unintended customer/design changes, secrets, missing keys, broken imports/routes, and unsupported legal/statistical claims.

## 10. Acceptance/testing matrix

### Navigation/roles

- / loads role selection; Officer opens /officer; Customer opens /customer.
- Valid demo credentials reach dashboard; invalid credentials show localized error.
- Direct dashboard access redirects without demo session; logout clears it.
- Officer dashboard reaches shared scanning/result/evidence/report path.
- Customer sample scan, overlay, results, team, and PDF continue working.

### Language/theme

- Only English/Hindi/Marathi appear in selector; English is default.
- Major UI content changes on every route/modal/toast/form/table/dashboard/result/team screen.
- Locale persists through navigation and reload.
- Light/dark work everywhere and persist independently.
- Dark contrast is readable for borders, buttons, tables, charts, status, and forms.

### Assets/responsive

- Supplied logo is sharp/proportional and does not change navbar layout.
- Six names map to six intended images; only Ved is replaced.
- Landing/auth/dashboard/scanner/results/reports/team/controls/FAB work at all target widths.

### Legal/reports

- English/Hindi/Marathi compliant and violation PDFs generate.
- Devanagari glyphs render; long text wraps; tables/sections stay inside margins; multiple pages have no overlap/clipping/overflow.
- Actual downloaded PDFs are text-extracted and rendered to images for inspection.
- Assistant distinguishes statutory source, guidance, user input, and AI explanation.
- Prototype analytics never claim real government statistics and unsupported penalty amounts are not shown.

### Quality/security

- npm run build passes strict TypeScript.
- No console/runtime errors, missing keys, broken imports/routes.
- No secrets/API keys in source or build.
- Invalid/unexpected input is safely handled.
- Existing light customer screens remain recognizable.

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Customer route extraction breaks behavior | Baseline and milestone smoke tests for scan/team/PDF. |
| English remains in Hindi/Marathi | Typed key inventory, missing-key warnings, locale matrix. |
| Light mode changes visually | Preserve light tokens and compare existing customer screens. |
| Prototype data looks official | Persistent sample labels, source metadata, no unsupported numbers. |
| Assistant invents law | Curated verified content/source labels; no unconstrained legal generation. |
| PDFs clip/corrupt Devanagari | Embedded Unicode font, measured layout, rendered-file checks. |
| FAB covers content | Safe-area/route-aware offsets and mobile review. |
| Wrong Ved image mapping | Confirm asset identity before copying. |
| Stale scanner timers | Centralized cleanup on unmount/route/sample change. |
| Remote images fail | Preserve current behavior initially; local mirroring is separate scope. |

## 12. Assumptions and open questions

Assumptions:

- The prototype is client-side/sample-driven; no hidden backend/API was found.
- Demo auth is UI-only and must not be described as secure.
- Dashboard records remain prototype data until a backend/source is supplied.
- The supplied logo can be copied after approval.
- Existing light palette/typography/radii/cards remain the design baseline.

Open questions:

1. The SIH presentation is not required; the pasted brief is the source of truth.
  2. The newly supplied portrait is the replacement image for Ved Patil. It is visible in the approved request but is not exposed as a filesystem attachment, so the existing Ved URL remains temporarily until a readable file path is supplied.
3. Mumbai is the intended prototype analytics geography. Verified Mumbai-specific public data is still required before any figures can be labeled real; otherwise the UI remains clearly sample/prototype data.
4. Should the other five remote team images remain remote, or should all assets be localized?
5. Is adding react-router-dom acceptable, or must routes use a custom History API adapter?
6. Is bundling a licensed Devanagari font acceptable for client-side PDFs?

## 13. Approval gate

This is the complete pre-implementation plan requested. Do not modify routes, components, styles, configuration, assets, backend, database, or existing functionality until the user explicitly approves it. After approval, follow the sequence above and update this file first if any material scope, dependency, design, or legal-source decision changes.
